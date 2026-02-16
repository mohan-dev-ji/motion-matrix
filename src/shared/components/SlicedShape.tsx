import React from "react";

interface SlicedShapeProps {
  type: "circle" | "polygon";
  sliceCount: number;
  shadedSlices: number[];
  size: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  rotation?: number;
  showDividers?: boolean;
  dividerOpacity?: number;
  outlineProgress?: number;
}

const VIEW_SIZE = 200;
const CENTER = VIEW_SIZE / 2;

export const SlicedShape: React.FC<SlicedShapeProps> = ({
  type,
  sliceCount,
  shadedSlices,
  size,
  fillColor = "#4f8ff7",
  fillOpacity = 1,
  strokeColor = "#e0e0e0",
  strokeWidth = 2,
  rotation = -Math.PI / 2,
  showDividers = true,
  dividerOpacity = 1,
  outlineProgress = 1,
}) => {
  const radius = CENTER - strokeWidth * 2;
  const angleStep = (2 * Math.PI) / sliceCount;
  const circumference = 2 * Math.PI * radius;

  const getPoint = (angle: number) => ({
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  });

  const getSlicePath = (index: number): string => {
    const startAngle = rotation + index * angleStep;
    const endAngle = rotation + (index + 1) * angleStep;
    const start = getPoint(startAngle);
    const end = getPoint(endAngle);

    if (type === "circle") {
      const largeArc = angleStep > Math.PI ? 1 : 0;
      return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    }
    return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} L ${end.x} ${end.y} Z`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
    >
      {/* Filled slices */}
      <g opacity={fillOpacity}>
        {Array.from({ length: sliceCount }).map((_, i) => (
          <path
            key={`fill-${i}`}
            d={getSlicePath(i)}
            fill={shadedSlices.includes(i) ? fillColor : "transparent"}
          />
        ))}
      </g>

      {/* Outline */}
      {type === "circle" ? (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - outlineProgress)}
          strokeLinecap="round"
        />
      ) : (
        <polygon
          points={Array.from({ length: sliceCount })
            .map((_, i) => {
              const p = getPoint(rotation + i * angleStep);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}

      {/* Divider lines */}
      {showDividers && (
        <g opacity={dividerOpacity}>
          {Array.from({ length: sliceCount }).map((_, i) => {
            const p = getPoint(rotation + i * angleStep);
            return (
              <line
                key={`div-${i}`}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth * 0.75}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};
