import React from "react";
import website from "@/app/config/website";

type Props = {
  name?: string | null;
  description?: string | null;
  thumbnailUrl: string[];
  uploadDate?: string | null;
  embedUrl?: string | null;
};

// https://developers.google.com/search/docs/appearance/structured-data/video
const VideoJsonLd = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
}: Props) => {
  if (!name || !thumbnailUrl.length || !uploadDate || !embedUrl) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description: description || name,
    thumbnailUrl,
    uploadDate,
    embedUrl,
    publisher: {
      "@type": "Organization",
      name: website.title,
      logo: {
        "@type": "ImageObject",
        url: website.image,
      },
    },
  };

  return (
    <script
      type='application/ld+json'
      // JSON.stringify output is escaped to prevent breaking out of the script tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export default VideoJsonLd;
