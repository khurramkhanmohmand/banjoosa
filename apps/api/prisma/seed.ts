/**
 * Seeds the canonical Banjoosa menu (36 items across 7 sections + 3 deals),
 * transcribed from the design handoff's `Banjoosa Prototype.dc.html` MENU/DEALS
 * arrays — that file is the source of truth for names, prices and copy.
 *
 * Idempotent: every upsert is keyed on a stable slug/name so re-running the
 * seed (e.g. after a schema change) never creates duplicates.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface AddOnDef {
  n: string;
  p: number;
}

const SHAW_ADD: AddOnDef[] = [
  { n: "Cheese", p: 80 },
  { n: "Sauce", p: 80 },
  { n: "Bread", p: 50 },
];
const BURG_ADD: AddOnDef[] = [
  { n: "Make a meal", p: 260 },
  { n: "Jalapeno", p: 60 },
  { n: "Cheese", p: 80 },
  { n: "Olives", p: 60 },
  { n: "Mushrooms", p: 60 },
];

const BREAD_LABEL = "Bread style";
const SIZE_LABEL = "Size";
const PORTION_LABEL = "Portion";

interface VariantDef {
  l: string;
  p: number;
}

interface MenuItemDef {
  id: string;
  sec: string;
  tag?: string;
  img: string;
  name: string;
  desc: string;
  long: string;
  vLabel?: string;
  variants?: VariantDef[];
  addons?: AddOnDef[];
  price?: number;
}

const MENU: MenuItemDef[] = [
  { id: "sh1", sec: "Shawarma", tag: "Roll", img: "wraps.png", name: "Chicken Roll Shawarma", desc: "Shredded chicken, garlic mayo, pickle, rolled hot.", long: "Charcoal chicken shredded off the spit with garlic mayo, pickle and slaw, rolled in your choice of bread.", vLabel: BREAD_LABEL, variants: [{ l: "Bread", p: 370 }, { l: "Chapati", p: 420 }, { l: "Paratha", p: 420 }], addons: SHAW_ADD },
  { id: "sh2", sec: "Shawarma", tag: "Arabian", img: "wraps.png", name: "Chicken Roll Arabian Shawarma", desc: "Arabian spice, toum sauce, fries inside.", long: "Arabian-spiced chicken with toum garlic sauce and fries tucked inside the roll.", vLabel: BREAD_LABEL, variants: [{ l: "Bread", p: 520 }, { l: "Chapati", p: 560 }, { l: "Paratha", p: 560 }], addons: SHAW_ADD },
  { id: "sh3", sec: "Shawarma", tag: "Platter", img: "pulled-burger.png", name: "Chicken Platter Shawarma", desc: "Open platter with fries, salad and dips.", long: "The roll opened out on a platter with fries, fresh salad and two dips. Made for sharing or a full lunch.", vLabel: BREAD_LABEL, variants: [{ l: "Bread", p: 610 }, { l: "Chapati", p: 650 }, { l: "Paratha", p: 720 }], addons: SHAW_ADD },
  { id: "sh4", sec: "Shawarma", tag: "Platter", img: "pulled-burger.png", name: "Chicken Platter Arabian Shawarma", desc: "Arabian platter, toum sauce, fries, salad.", long: "Arabian-spiced platter with toum sauce, fries and salad. The biggest plate on the shawarma counter.", vLabel: BREAD_LABEL, variants: [{ l: "Bread", p: 840 }, { l: "Chapati", p: 830 }, { l: "Paratha", p: 970 }], addons: SHAW_ADD },

  { id: "pw1", sec: "Paratha & Wrap", tag: "Popular", img: "wraps.png", name: "Zingeratha Roll", desc: "Zinger fillet strips rolled in a flaky paratha.", long: "Crispy zinger strips, mayo and pickled onion rolled in a flaky paratha and pressed on the flat top.", addons: SHAW_ADD, price: 520 },
  { id: "pw2", sec: "Paratha & Wrap", tag: "Classic", img: "wraps.png", name: "Kabab Paratha", desc: "Chicken kabab, chutney, onion, paratha.", long: "House chicken kabab with green chutney and sliced onion in a warm paratha.", addons: SHAW_ADD, price: 450 },
  { id: "pw3", sec: "Paratha & Wrap", tag: "Wrap", img: "wraps.png", name: "Fillet Wrap", desc: "Crispy fillet, lettuce, sauce, tortilla.", long: "Whole crispy chicken fillet with lettuce and house sauce wrapped in a soft tortilla.", addons: SHAW_ADD, price: 690 },
  { id: "pw4", sec: "Paratha & Wrap", tag: "Wrap", img: "wraps.png", name: "Grilled Wrap", desc: "Grilled chicken, fries, cheese, garlic mayo.", long: "Grilled chicken strips with fries, cheese and garlic mayo, rolled and toasted.", addons: SHAW_ADD, price: 690 },

  { id: "b1", sec: "Burgers", tag: "Best seller", img: "crispy-burger.png", name: "Zinger Burger", desc: "Buttermilk fillet, lettuce, mayo, sesame bun.", long: "Buttermilk-brined fillet, double dredged and fried to order, with lettuce and mayo in a sesame bun.", addons: BURG_ADD, price: 590 },
  { id: "b2", sec: "Burgers", tag: "Double", img: "cheeseburger.png", name: "Stacker Burger", desc: "Two patties, cheese, pickles, house sauce.", long: "Two chicken patties stacked with cheese, pickles and house sauce.", addons: BURG_ADD, price: 490 },
  { id: "b3", sec: "Burgers", tag: "Fillet", img: "crispy-burger.png", name: "Fillet Burger", desc: "Whole grilled fillet, lettuce, mayo.", long: "A whole grilled chicken fillet with lettuce and mayo, lighter than the zinger.", addons: BURG_ADD, price: 590 },
  { id: "b4", sec: "Burgers", tag: "Everyday", img: "cheeseburger.png", name: "Chicken Patty Burger", desc: "Crumbed patty, ketchup, mayo, soft bun.", long: "The everyday burger: crumbed chicken patty, ketchup and mayo in a soft bun.", addons: BURG_ADD, price: 460 },
  { id: "b5", sec: "Burgers", tag: "Desi", img: "pulled-burger.png", name: "Chicken Chapli Burger", desc: "Spiced chapli patty, onion, chutney.", long: "Flat-pressed spiced chapli patty with raw onion and green chutney.", addons: BURG_ADD, price: 380 },
  { id: "b6", sec: "Burgers", tag: "Classic", img: "cheeseburger.png", name: "Chicken Classic Burger", desc: "Grilled chicken, cheese slice, salad.", long: "Grilled chicken breast with a cheese slice, tomato and lettuce.", addons: BURG_ADD, price: 530 },
  { id: "b7", sec: "Burgers", tag: "Value", img: "pulled-burger.png", name: "Anda Shami", desc: "Shami kabab and fried egg in a bun.", long: "Shami kabab with a fried egg, onion and chutney. The Rs 250 breakfast fix.", addons: BURG_ADD, price: 250 },

  { id: "f1", sec: "Fries", tag: "Loaded", img: "loaded-fries.png", name: "Garlic Mayo Fries", desc: "Fries under garlic mayo and herbs.", long: "Hand-cut fries covered in garlic mayo and dried herbs.", price: 450 },
  { id: "f2", sec: "Fries", tag: "Loaded", img: "loaded-fries.png", name: "BBQ Fries", desc: "Smoky BBQ sauce, crispy onion.", long: "Fries tossed in smoky BBQ sauce with crispy onions on top.", price: 450 },
  { id: "f3", sec: "Fries", tag: "Sharing", img: "loaded-fries.png", name: "Loaded Fries", desc: "Cheese sauce, chicken, jalapeño.", long: "Cheese sauce, shredded chicken and jalapeños over a full basket. Feeds two.", price: 830 },
  { id: "f4", sec: "Fries", tag: "Classic", img: "loaded-fries.png", name: "Plain Fries", desc: "Salted, ketchup on the side.", long: "Double fried and salted the second they come out of the basket.", vLabel: PORTION_LABEL, variants: [{ l: "Regular", p: 340 }, { l: "Large", p: 540 }] },
  { id: "f5", sec: "Fries", tag: "Spiced", img: "loaded-fries.png", name: "Masala Fries", desc: "Chaat masala, lemon, green chilli.", long: "Fries dusted with chaat masala and finished with lemon and green chilli.", vLabel: PORTION_LABEL, variants: [{ l: "Regular", p: 380 }, { l: "Large", p: 590 }] },

  { id: "p1", sec: "Pizza", tag: "Classic", img: "pizza.png", name: "Margherita", desc: "Tomato base, mozzarella, oregano.", long: "Slow-cooked tomato base under mozzarella, finished with oregano.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 690 }, { l: "Medium", p: 1290 }, { l: "Large", p: 1930 }] },
  { id: "p2", sec: "Pizza", tag: "Classic", img: "pizza.png", name: "Chicken Fajita", desc: "Fajita chicken, capsicum, onion.", long: "Fajita-spiced chicken with capsicum and onion over mozzarella.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 690 }, { l: "Medium", p: 1290 }, { l: "Large", p: 1930 }] },
  { id: "p3", sec: "Pizza", tag: "Classic", img: "pizza.png", name: "Chicken Tikka", desc: "Tikka chicken, onion, tikka sauce.", long: "Tandoori tikka chicken with onion and a tikka sauce swirl.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 690 }, { l: "Medium", p: 1290 }, { l: "Large", p: 1930 }] },
  { id: "p4", sec: "Pizza", tag: "Signature", img: "pizza.png", name: "Chicken Supreme", desc: "Loaded chicken, olives, capsicum, extra cheese.", long: "Three chicken toppings with olives, capsicum, mushroom and a double cheese blanket.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 870 }, { l: "Medium", p: 1560 }, { l: "Large", p: 2280 }] },
  { id: "p5", sec: "Pizza", tag: "Signature", img: "pizza.png", name: "Pepperoni", desc: "Double pepperoni, mozzarella, chilli oil.", long: "Double chicken pepperoni over mozzarella, finished with chilli oil.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 870 }, { l: "Medium", p: 1560 }, { l: "Large", p: 2280 }] },
  { id: "p6", sec: "Pizza", tag: "Signature", img: "pizza.png", name: "Mughlai Beast", desc: "Malai boti, kabab, mughlai sauce.", long: "Malai boti and seekh kabab on a rich mughlai sauce base.", vLabel: SIZE_LABEL, variants: [{ l: "Small", p: 870 }, { l: "Medium", p: 1560 }, { l: "Large", p: 2280 }] },
  { id: "p7", sec: "Pizza", tag: "Signature", img: "pizza.png", name: "Crown Crust Pizza", desc: "Cheese-stuffed crown of kababs around the rim.", long: "A crown of cheese-stuffed kababs baked around the rim, loaded centre. Medium and large only.", vLabel: SIZE_LABEL, variants: [{ l: "Medium", p: 1860 }, { l: "Large", p: 2880 }] },

  { id: "s1", sec: "Side Order", tag: "10 pcs", img: "crispy-burger.png", name: "Baked Wings (10 pcs)", desc: "Oven baked, tossed in house rub.", long: "Ten wings baked and tossed in the house rub, with a dip.", price: 720 },
  { id: "s2", sec: "Side Order", tag: "10 pcs", img: "crispy-burger.png", name: "Chicken Nuggets (10 pcs)", desc: "Crumbed nuggets with ketchup and mayo.", long: "Ten crumbed chicken nuggets with ketchup and mayo dips.", price: 590 },
  { id: "s3", sec: "Side Order", tag: "Baked", img: "", name: "Baked Macaroni Pasta", desc: "White sauce macaroni baked with cheese.", long: "White sauce macaroni with chicken, baked under a cheese crust.", price: 690 },

  { id: "dr1", sec: "Drinks", img: "", name: "345ml Pepsi / 7up", desc: "Chilled can.", long: "Chilled 345ml can.", price: 90 },
  { id: "dr2", sec: "Drinks", img: "", name: "500ml Pepsi / 7up", desc: "Chilled bottle.", long: "Chilled 500ml bottle.", price: 130 },
  { id: "dr3", sec: "Drinks", img: "", name: "1000ml Pepsi / 7up", desc: "One litre bottle.", long: "One litre bottle, good for two.", price: 180 },
  { id: "dr4", sec: "Drinks", img: "", name: "1500ml Pepsi / 7up", desc: "Family bottle.", long: "Family size 1.5 litre bottle.", price: 260 },
  { id: "dr5", sec: "Drinks", img: "", name: "500ml Mineral Water", desc: "Chilled water.", long: "Chilled 500ml mineral water.", price: 70 },
  { id: "dr6", sec: "Drinks", img: "", name: "1500ml Mineral Water", desc: "Family bottle.", long: "Chilled 1.5 litre mineral water.", price: 120 },
];

const DEALS = [
  { id: "dl1", img: "crispy-burger.png", name: "ZINGER MEAL", price: 850, wasPrice: 1100, desc: "Zinger burger, regular fries and a 345ml drink.", long: "Zinger burger with regular fries and a chilled can." },
  { id: "dl2", img: "wraps.png", name: "ROLL & FRIES", price: 750, wasPrice: 900, desc: "Chicken roll shawarma, masala fries and a drink.", long: "Chicken roll shawarma with regular masala fries and a can." },
  { id: "dl3", img: "pizza.png", name: "FAMILY PIZZA DEAL", price: 2540, wasPrice: 2900, desc: "Large Chicken Supreme, 10 pcs wings and a 1.5L bottle.", long: "Large Chicken Supreme with ten baked wings and a 1.5 litre bottle." },
];

const SECTION_ORDER = ["Shawarma", "Paratha & Wrap", "Burgers", "Fries", "Pizza", "Side Order", "Drinks"] as const;
const SEC_NOTE: Record<string, string> = {
  Shawarma: "Choose bread, chapati or paratha",
  "Paratha & Wrap": "Rolled and pressed to order",
  Burgers: "Make any burger a meal +Rs 260",
  Fries: "Regular and large portions",
  Pizza: "Small · Medium · Large",
  "Side Order": "Baked, not fried",
  Drinks: "Chilled, all sizes",
};

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: "banjoosa-gulberg-3" },
    update: {},
    create: {
      id: "banjoosa-gulberg-3",
      name: "Gulberg III",
      address: "12-C Main Boulevard, near Liberty roundabout, Lahore",
      phone: "042-34551755",
      hours: "11:00 am – 2:00 am",
      isActive: true,
    },
  });

  const sectionByName = new Map<string, string>();
  for (let i = 0; i < SECTION_ORDER.length; i++) {
    const name = SECTION_ORDER[i]!;
    const section = await prisma.menuSection.upsert({
      where: { name },
      update: { note: SEC_NOTE[name] ?? "", sortOrder: i },
      create: { name, note: SEC_NOTE[name] ?? "", sortOrder: i },
    });
    sectionByName.set(name, section.id);
  }

  const addOnByName = new Map<string, string>();
  const allAddOnDefs = [...SHAW_ADD, ...BURG_ADD];
  for (const def of allAddOnDefs) {
    if (addOnByName.has(def.n)) continue;
    const addOn = await prisma.addOn.upsert({
      where: { name: def.n },
      update: { price: def.p },
      create: { name: def.n, price: def.p },
    });
    addOnByName.set(def.n, addOn.id);
  }

  for (let i = 0; i < MENU.length; i++) {
    const def = MENU[i]!;
    const sectionId = sectionByName.get(def.sec);
    if (!sectionId) throw new Error(`Unknown section: ${def.sec}`);
    const slug = slugify(def.name);

    const menuItem = await prisma.menuItem.upsert({
      where: { id: def.id },
      update: {
        tag: def.tag ?? null,
        description: def.desc,
        longDescription: def.long,
        imageUrl: def.img ? `/menu/${def.img}` : null,
        hasVariants: !!def.variants,
        variantLabel: def.vLabel ?? null,
        basePrice: def.variants ? null : def.price ?? null,
        sortOrder: i,
      },
      create: {
        id: def.id,
        branchId: branch.id,
        sectionId,
        name: def.name,
        slug,
        tag: def.tag ?? null,
        description: def.desc,
        longDescription: def.long,
        imageUrl: def.img ? `/menu/${def.img}` : null,
        hasVariants: !!def.variants,
        variantLabel: def.vLabel ?? null,
        basePrice: def.variants ? null : def.price ?? null,
        sortOrder: i,
      },
    });

    if (def.variants) {
      await prisma.menuItemVariant.deleteMany({ where: { menuItemId: menuItem.id } });
      for (let vi = 0; vi < def.variants.length; vi++) {
        const v = def.variants[vi]!;
        await prisma.menuItemVariant.create({
          data: { menuItemId: menuItem.id, label: v.l, price: v.p, sortOrder: vi },
        });
      }
    }

    if (def.addons) {
      await prisma.menuItemAddOn.deleteMany({ where: { menuItemId: menuItem.id } });
      for (const a of def.addons) {
        const addOnId = addOnByName.get(a.n);
        if (!addOnId) continue;
        await prisma.menuItemAddOn.create({ data: { menuItemId: menuItem.id, addOnId } });
      }
    }
  }

  for (let i = 0; i < DEALS.length; i++) {
    const def = DEALS[i]!;
    await prisma.deal.upsert({
      where: { id: def.id },
      update: {
        name: def.name,
        description: def.desc,
        longDescription: def.long,
        price: def.price,
        wasPrice: def.wasPrice,
        imageUrl: def.img ? `/menu/${def.img}` : null,
        sortOrder: i,
      },
      create: {
        id: def.id,
        branchId: branch.id,
        name: def.name,
        description: def.desc,
        longDescription: def.long,
        price: def.price,
        wasPrice: def.wasPrice,
        imageUrl: def.img ? `/menu/${def.img}` : null,
        sortOrder: i,
      },
    });
  }

  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@banjoosa.test";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Super Admin" },
  });

  console.log(`Seeded branch "${branch.name}", ${MENU.length} menu items, ${DEALS.length} deals, admin user ${adminEmail}.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
