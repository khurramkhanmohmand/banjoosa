import type { ChangeEvent } from "react";
import { Input } from "@banjoosa/ui";
import { DeliveryMode } from "@banjoosa/types";

export interface CheckoutFormValues {
  name: string;
  phone: string;
  address: string;
  deliveryNote: string;
  pickupTime: string;
}

interface CheckoutFormFieldsProps {
  mode: DeliveryMode;
  branchName: string;
  values: CheckoutFormValues;
  onChange: (values: CheckoutFormValues) => void;
}

export function CheckoutFormFields({ mode, branchName, values, onChange }: CheckoutFormFieldsProps) {
  const set = (key: keyof CheckoutFormValues) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...values, [key]: e.target.value });

  return (
    <div className="flex flex-col gap-3">
      <Input label="Name" placeholder="Ayesha Khan" value={values.name} onChange={set("name")} />
      <Input label="Phone" placeholder="+92 3xx xxx xxxx" value={values.phone} onChange={set("phone")} />

      {mode === DeliveryMode.DELIVERY ? (
        <>
          <Input
            label="Address"
            placeholder="House 12, Street 4, Gulberg III"
            value={values.address}
            onChange={set("address")}
          />
          <Input
            label="Delivery note"
            placeholder="Ring the bell twice"
            value={values.deliveryNote}
            onChange={set("deliveryNote")}
          />
        </>
      ) : (
        <>
          <Input label="Pickup branch" value={branchName} disabled />
          <Input
            label="Pickup time"
            placeholder="In 20 minutes"
            value={values.pickupTime}
            onChange={set("pickupTime")}
          />
        </>
      )}
    </div>
  );
}
