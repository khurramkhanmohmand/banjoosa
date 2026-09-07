const INSTAGRAM_URL = "https://www.instagram.com/banjoosa_lhr/";
const FACEBOOK_URL = "https://facebook.com/BanjoosaFastFood";

export function Footer() {
  return (
    <div className="bg-ink text-cream px-6 py-10 mt-5">
      <div className="max-w-page mx-auto flex justify-between gap-6 flex-wrap items-center">
        <div className="font-display text-xl text-brand-yellow">BANJOOSA · SINCE 1993</div>
        <div className="font-ui text-lg tracking-wide uppercase flex gap-6 flex-wrap items-center">
          <span>042-34551755</span>
          <span>0319-6990909</span>
          <span>Franchise</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
            </svg>
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
