import * as React from "react"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

export function Avatar({
  src,
  alt,
  size = "md",
  className = "",
  children,
  ...props
}: AvatarProps) {
  const sizeMap: Record<string, string> = {
    sm: "w-8 h-8 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-14 h-14 text-lg",
  }

  const sizeClass = sizeMap[size] ?? sizeMap.md

  return (
    <div
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-full bg-white",
        "overflow-hidden",
        "shadow-sm ring-1 ring-black/10",
        sizeClass,
        className,
      ].join(" ")}
      aria-hidden={props["aria-hidden"] ?? false}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="text-black font-semibold">{children}</span>
      )}
    </div>
  )
}

export function AvatarFallback({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={["text-black font-semibold"].join(" ")}>
      {children}
    </span>
  )
}