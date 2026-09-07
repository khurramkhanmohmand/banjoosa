import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import {
  CartItemType,
  DeliveryMode,
  type CreateOrderRequest,
  type Order as OrderDTO,
  type OrderStatus,
} from "@banjoosa/types";
import { prisma } from "../lib/prisma";
import { NotFoundError, ValidationError } from "../lib/errors";
import {
  DELIVERY_ETA_MINUTES,
  DELIVERY_FEE_RS,
  FREE_DELIVERY_THRESHOLD_RS,
  ORDER_NUMBER_PREFIX,
  PICKUP_ETA_MINUTES,
  TAX_RATE,
} from "../config/constants";

const orderInclude = { items: true } satisfies Prisma.OrderInclude;
type PrismaOrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toOrderDTO(order: PrismaOrderWithItems): OrderDTO {
  return {
    id: order.id,
    branchId: order.branchId,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryMode: order.deliveryMode,
    address: order.address,
    deliveryNote: order.deliveryNote,
    pickupTime: order.pickupTime,
    paymentMethod: order.paymentMethod,
    status: order.status,
    items: order.items.map((line) => ({
      id: line.id,
      itemType: line.itemType,
      refId: line.refId,
      name: line.name,
      variantLabel: line.variantLabel,
      addOnLabels: line.addOnLabels,
      unitPrice: line.unitPrice,
      qty: line.qty,
      lineTotal: line.lineTotal,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    total: order.total,
    etaMinutes: order.etaMinutes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

interface PricedLine {
  itemType: CartItemType;
  refId: string;
  name: string;
  variantLabel: string | null;
  addOnLabels: string[];
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

/**
 * Re-derives every line's price from the database — the client only sends
 * item/variant/add-on ids and a quantity. Trusting client-sent prices would
 * let anyone check out at whatever total they choose.
 */
async function priceOrderItems(items: CreateOrderRequest["items"]): Promise<PricedLine[]> {
  const priced: PricedLine[] = [];

  for (const line of items) {
    if (line.itemType === CartItemType.MENU_ITEM) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: line.itemId },
        include: { variants: true, addOns: { include: { addOn: true } } },
      });
      if (!menuItem || !menuItem.isAvailable) {
        throw new ValidationError(`Menu item ${line.itemId} is not available`);
      }

      let unitPrice: number;
      let variantLabel: string | null = null;
      if (menuItem.hasVariants) {
        const variant = menuItem.variants.find((v) => v.id === line.variantId);
        if (!variant) throw new ValidationError(`Invalid variant for ${menuItem.name}`);
        unitPrice = variant.price;
        variantLabel = variant.label;
      } else {
        if (menuItem.basePrice === null) throw new ValidationError(`${menuItem.name} has no price configured`);
        unitPrice = menuItem.basePrice;
      }

      const addOnLabels: string[] = [];
      for (const addOnId of line.addOnIds) {
        const match = menuItem.addOns.find((a) => a.addOnId === addOnId);
        if (!match) throw new ValidationError(`Invalid add-on for ${menuItem.name}`);
        unitPrice += match.addOn.price;
        addOnLabels.push(match.addOn.name);
      }

      priced.push({
        itemType: CartItemType.MENU_ITEM,
        refId: menuItem.id,
        name: menuItem.name,
        variantLabel,
        addOnLabels: addOnLabels.sort(),
        unitPrice,
        qty: line.qty,
        lineTotal: unitPrice * line.qty,
      });
    } else {
      const deal = await prisma.deal.findUnique({ where: { id: line.itemId } });
      if (!deal || !deal.isActive) {
        throw new ValidationError(`Deal ${line.itemId} is not available`);
      }
      priced.push({
        itemType: CartItemType.DEAL,
        refId: deal.id,
        name: deal.name,
        variantLabel: null,
        addOnLabels: [],
        unitPrice: deal.price,
        qty: line.qty,
        lineTotal: deal.price * line.qty,
      });
    }
  }

  return priced;
}

export async function createOrder(input: CreateOrderRequest): Promise<OrderDTO> {
  const branch = await prisma.branch.findUnique({ where: { id: input.branchId } });
  if (!branch || !branch.isActive) throw new NotFoundError("Branch");

  const pricedLines = await priceOrderItems(input.items);
  const subtotal = pricedLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const isDelivery = input.deliveryMode === DeliveryMode.DELIVERY;
  const deliveryFee = isDelivery ? (subtotal >= FREE_DELIVERY_THRESHOLD_RS ? 0 : DELIVERY_FEE_RS) : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + deliveryFee + tax;
  const etaMinutes = isDelivery ? DELIVERY_ETA_MINUTES : PICKUP_ETA_MINUTES;

  const created = await prisma.$transaction(async (tx) => {
    const placeholderNumber = `PENDING-${randomUUID()}`;
    const order = await tx.order.create({
      data: {
        orderNumber: placeholderNumber,
        branchId: branch.id,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryMode: input.deliveryMode,
        address: input.address,
        deliveryNote: input.deliveryNote,
        pickupTime: input.pickupTime,
        paymentMethod: input.paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total,
        etaMinutes,
        items: {
          create: pricedLines.map((l) => ({
            itemType: l.itemType,
            refId: l.refId,
            name: l.name,
            variantLabel: l.variantLabel,
            addOnLabels: l.addOnLabels,
            unitPrice: l.unitPrice,
            qty: l.qty,
            lineTotal: l.lineTotal,
          })),
        },
      },
      include: orderInclude,
    });

    const orderNumber = `${ORDER_NUMBER_PREFIX}-${1000 + order.sequence}`;
    return tx.order.update({ where: { id: order.id }, data: { orderNumber }, include: orderInclude });
  });

  return toOrderDTO(created);
}

export async function getOrderById(id: string): Promise<OrderDTO> {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  if (!order) throw new NotFoundError("Order");
  return toOrderDTO(order);
}

export interface ListOrdersFilter {
  status?: OrderStatus;
}

export async function listOrdersForBranch(branchId: string, filter: ListOrdersFilter = {}): Promise<OrderDTO[]> {
  const orders = await prisma.order.findMany({
    where: { branchId, ...(filter.status ? { status: filter.status } : {}) },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return orders.map(toOrderDTO);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Order");
  const updated = await prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
  return toOrderDTO(updated);
}
