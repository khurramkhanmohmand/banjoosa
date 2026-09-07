import { Marquee } from "@banjoosa/ui";

const TICKER_TEXT =
  "MAKE ANY BURGER A MEAL +RS 260 ★ FREE DELIVERY OVER RS 2000 ★ ANDA SHAMI RS 250 ★ CROWN CRUST IS BACK ★ ";

export function PromoTicker() {
  return <Marquee text={TICKER_TEXT} className="bg-brand-yellow border-y-4 border-ink py-3" />;
}
