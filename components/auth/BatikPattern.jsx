// components/auth/BatikPattern.jsx

export function KawungPattern({ className = "", opacity = 0.35, color = "#CBA135" }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="kawung-motif"
          x="0"
          y="0"
          width="110"
          height="110"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={color} strokeWidth="1.1" opacity={opacity}>
            <ellipse cx="55" cy="30" rx="15" ry="23" />
            <ellipse cx="55" cy="80" rx="15" ry="23" />
            <ellipse cx="30" cy="55" rx="23" ry="15" />
            <ellipse cx="80" cy="55" rx="23" ry="15" />
            <circle cx="55" cy="55" r="4.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawung-motif)" />
    </svg>
  );
}

export function TumpalBorder({ className = "", color = "#CBA135", count = 10 }) {
  const triangles = Array.from({ length: count });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${count * 40} 40`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {triangles.map((_, i) => (
        <polygon
          key={i}
          points={`${i * 40},40 ${i * 40 + 20},4 ${i * 40 + 40},40`}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}