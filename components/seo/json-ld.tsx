import { softwareApplicationJsonLd } from "@/lib/seo";

export function JsonLd() {
  const data = softwareApplicationJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
