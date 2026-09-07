import { Pill } from "@banjoosa/ui";
import { DeliveryMode } from "@banjoosa/types";

interface DeliveryModeToggleProps {
  mode: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
}

export function DeliveryModeToggle({ mode, onChange }: DeliveryModeToggleProps) {
  return (
    <div className="flex gap-2.5">
      {([DeliveryMode.DELIVERY, DeliveryMode.PICKUP] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={[
            "flex-1 text-center font-ui font-bold uppercase tracking-wide text-lg py-2.5 rounded-full border-[3px] border-ink cursor-pointer",
            mode === m ? "bg-brand-yellow text-ink" : "bg-white text-ink",
          ].join(" ")}
        >
          {m === DeliveryMode.DELIVERY ? "Delivery" : "Pickup"}
        </button>
      ))}
    </div>
  );
}
