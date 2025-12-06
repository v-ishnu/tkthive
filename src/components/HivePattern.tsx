'use client';

import React, { useRef, useState, useEffect } from 'react';

interface HivePatternProps {
  className?: string;
  intensity?: number; // Opacity of the effect
}

export const HivePattern: React.FC<HivePatternProps> = ({ className = "", intensity = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Attach listener to parent to handle pointer-events-none on self
    const parent = container.parentElement;
    if (!parent) return;

    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') {
        parent.style.position = 'relative';
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setMousePos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Seamless Hexagon Tile Pattern
  // This path draws the necessary lines to tessellate perfectly when repeated
  const svgPath = "M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100";
  const svgWidth = 56;
  const svgHeight = 100;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* 1. Base Layer: Subtle White/Gray Outline (Always Visible) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='${svgWidth}' height='${svgHeight}' viewBox='0 0 ${svgWidth} ${svgHeight}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${svgPath}' fill='none' stroke='white' stroke-width='1' stroke-opacity='0.1' /%3E%3C/svg%3E")`,
          opacity: 1 * intensity
        }}
      />

      {/* 2. Highlight Layer: Vivid Yellow Outline (Revealed by Mask) */}
      <div 
        className="absolute inset-0 z-10 will-change-[mask-image]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='${svgWidth}' height='${svgHeight}' viewBox='0 0 ${svgWidth} ${svgHeight}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${svgPath}' fill='none' stroke='%23FFD60A' stroke-width='2' /%3E%3C/svg%3E")`,
          maskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          opacity: 1 * intensity
        }}
      />
    </div>
  );
};