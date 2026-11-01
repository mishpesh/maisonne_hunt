import { useId } from "react";

/** User-supplied PNG silhouette, tinted to match its surrounding link or button. */
export default function ActionArrow({ size = 18 }: { size?: number }) {
  const maskId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="40 11 62 106"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <mask
          id={maskId}
          x="0"
          y="0"
          width="128"
          height="128"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <image
            href="/images/icons/action-chevron.png"
            width="128"
            height="128"
          />
        </mask>
      </defs>
      <rect
        width="128"
        height="128"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
