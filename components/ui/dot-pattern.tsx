import { ComponentProps, useId } from "react";

import { cn } from "@/lib/utils";

interface DotPatternProps extends ComponentProps<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  dotColor?: string;
  backgroundColor?: string;
}
export function DotPattern({
  width = 64,
  height = 64,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  dotColor = "sky-300",
  backgroundColor = "transparent",
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <rect width={width} height={height} fill={backgroundColor} />
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export default DotPattern;
