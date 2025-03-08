export default function ChevronLeftSVG({
  width,
  height,
}: Readonly<{
  width?: number;
  height?: number;
}>) {
  return (
    <svg
      width={width ?? 22}
      height={height ?? 30}
      viewBox="0 0 22 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6.96753"
        y="21.5242"
        width="9.00908"
        height="20.6169"
        rx="4.50454"
        transform="rotate(-135 6.96753 21.5242)"
        fill="white"
      />
      <rect
        x="0.67627"
        y="15.2545"
        width="9.00908"
        height="20.6169"
        rx="4.50454"
        transform="rotate(-45 0.67627 15.2545)"
        fill="white"
      />
    </svg>
  );
}
