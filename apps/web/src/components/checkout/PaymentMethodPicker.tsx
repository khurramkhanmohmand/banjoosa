import { Pill } from "@banjoosa/ui";
import { PaymentMethod } from "@banjoosa/types";

const LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CARD]: "Card",
  [PaymentMethod.CASH_ON_DELIVERY]: "Cash on delivery",
  [PaymentMethod.WALLET]: "Wallet",
};

interface PaymentMethodPickerProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({ value, onChange }: PaymentMethodPickerProps) {
  return (
    <div>
      <div className="font-ui font-bold uppercase tracking-wide text-sm text-meta mb-2">Payment</div>
      <div className="flex gap-2.5 flex-wrap">
        {(Object.values(PaymentMethod) as PaymentMethod[]).map((method) => (
          <Pill key={method} active={value === method} onClick={() => onChange(method)}>
            {LABELS[method]}
          </Pill>
        ))}
      </div>
    </div>
  );
}
