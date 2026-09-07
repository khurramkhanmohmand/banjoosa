/** Site-wide editable content — the Home hero photo and promo ticker today. */
export interface SiteSettings {
  heroImageUrl: string | null;
  tickerText: string;
}

export interface UpdateSiteSettingsRequest {
  heroImageUrl: string | null;
  tickerText: string;
}

export interface UploadResponse {
  url: string;
}
