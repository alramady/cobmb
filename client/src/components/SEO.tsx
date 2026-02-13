import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const BASE_TITLE = "CoBnB KSA — The BNB Expert";
const BASE_URL = "https://cobnb.vip";
const DEFAULT_DESC = "Premium short-term rental management in Saudi Arabia. Riyadh, Jeddah, Madinah. Property management, guest services, and revenue optimization.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({ title, description, image, url, type = "website", noindex }: SEOProps) {
  const fullTitle = title ? `${title} | CoBnB KSA` : BASE_TITLE;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMAGE;
  const canonical = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="CoBnB KSA" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
