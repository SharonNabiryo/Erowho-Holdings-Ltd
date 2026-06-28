import React, { useState } from "react";
import { PROPERTY_IMAGES, C } from "./tokens";
import type { Property } from "./api";

// ── PropImage ─────────────────────────────────────────────────────────────────
// Renders a real Unsplash photo. Falls back to the type-based default image
// if the property's image_url is missing or fails to load.

interface PropImageProps {
  property: Property;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function PropImage({ property, height = 220, className, style }: PropImageProps) {
  const fallbackUrl = PROPERTY_IMAGES[property.property_type] || PROPERTY_IMAGES["default"];
  const primaryUrl  = property.image_url && property.image_url.trim() !== "" ? property.image_url : fallbackUrl;
  const [src, setSrc] = useState(primaryUrl);

  const handleError = () => {
    if (src !== fallbackUrl) setSrc(fallbackUrl);
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        height,
        background: C.sand,
        ...style,
      }}
    >
      <img
        src={src}
        alt={property.title}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.5s ease",
        }}
      />
    </div>
  );
}

// ── PropTypeImage ─────────────────────────────────────────────────────────────
// Renders a fallback image based only on property type string (used in admin).
interface PropTypeImageProps {
  propertyType: string;
  height?: number | string;
  style?: React.CSSProperties;
}

export function PropTypeImage({ propertyType, height = 160, style }: PropTypeImageProps) {
  const url = PROPERTY_IMAGES[propertyType] || PROPERTY_IMAGES["default"];
  const [src, setSrc] = useState(url);

  return (
    <div style={{ position: "relative", overflow: "hidden", height, background: C.sand, borderRadius: 8, ...style }}>
      <img
        src={src}
        alt={propertyType}
        onError={() => setSrc(PROPERTY_IMAGES["default"])}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(42,33,27,0.6) 0%, transparent 100%)",
        padding: "12px 14px",
      }}>
        <span style={{ fontSize: 11, color: "#FAF6F0", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>
          {propertyType.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ── Legacy export — keeps any remaining import of PropIllustration working ────
export function PropIllustration({
  propertyType,
  style,
}: {
  propertyType: string;
  style?: React.CSSProperties;
}) {
  const url = PROPERTY_IMAGES[propertyType] || PROPERTY_IMAGES["default"];
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", ...style }}>
      <img
        src={url}
        alt={propertyType}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
