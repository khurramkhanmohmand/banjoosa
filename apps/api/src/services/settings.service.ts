import type { SiteSettings, UpdateSiteSettingsRequest } from "@banjoosa/types";
import { prisma } from "../lib/prisma";

const SETTINGS_ID = "singleton";
const DEFAULT_TICKER_TEXT =
  "MAKE ANY BURGER A MEAL +RS 260 ★ FREE DELIVERY OVER RS 2000 ★ ANDA SHAMI RS 250 ★ CROWN CRUST IS BACK ★ ";

export async function getSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, heroImageUrl: "/menu/pulled-burger.png", tickerText: DEFAULT_TICKER_TEXT },
  });
  return { heroImageUrl: settings.heroImageUrl, tickerText: settings.tickerText };
}

export async function updateSettings(input: UpdateSiteSettingsRequest): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { heroImageUrl: input.heroImageUrl, tickerText: input.tickerText },
    create: { id: SETTINGS_ID, heroImageUrl: input.heroImageUrl, tickerText: input.tickerText },
  });
  return { heroImageUrl: settings.heroImageUrl, tickerText: settings.tickerText };
}
