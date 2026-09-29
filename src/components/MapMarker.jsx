import React from 'react';
import { motion } from 'framer-motion';

export default function MapMarker({
  destination,
  x,
  y,
  isSelected = false,
  onClick,
  onHover,
  onLeave
}) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group"
      onClick={() => onClick(destination)}
      onMouseEnter={() => onHover && onHover(destination, x, y)}
      onMouseLeave={() => onLeave && onLeave()}
    >
      {/* Outer Pulse Radar */}
      <circle
        r={isSelected ? 16 : 10}
        className={`transition-all duration-300 ${
          isSelected
            ? 'fill-accent/30 stroke-accent'
            : 'fill-highlight/20 stroke-highlight/60 group-hover:fill-secondary/40'
        }`}
      >
        <animate
          attributeName="r"
          values={isSelected ? "12;22;12" : "7;14;7"}
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0.2;0.8"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main Pin Dot */}
      <circle
        r={isSelected ? 6 : 4}
        className={`transition-all duration-300 ${
          isSelected
            ? 'fill-accent stroke-white stroke-2'
            : 'fill-highlight stroke-primary-dark stroke-1.5 group-hover:fill-secondary group-hover:r-5'
        }`}
      />

      {/* Destination Label on Hover or when selected */}
      <text
        y={-10}
        textAnchor="middle"
        className={`text-[9px] font-bold tracking-wider uppercase select-none pointer-events-none transition-all ${
          isSelected
            ? 'fill-accent font-extrabold'
            : 'fill-white opacity-0 group-hover:opacity-100 drop-shadow-md'
        }`}
      >
        {destination.name}
      </text>
    </g>
  );
}
