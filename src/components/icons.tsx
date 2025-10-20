import * as React from "react"

export function SynergyOSLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g className="transition-transform duration-300 group-hover:rotate-[10deg]">
        <path
          d="M50 10 C 27.9 10, 10 27.9, 10 50 C 10 72.1, 27.9 90, 50 90 C 72.1 90, 90 72.1, 90 50"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="12" fill="hsl(var(--accent))" />
        <path
          d="M50 10 A 40 40 0 0 1 85.35 34.64"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}
