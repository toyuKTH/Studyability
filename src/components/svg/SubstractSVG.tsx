export default function SubstractSVG({
  width,
  height,
}: Readonly<{
  width?: number;
  height?: number;
}>) {
  return (
    <svg
      width={width ?? 27}
      height={height ?? 5}
      viewBox="0 0 27 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.912354"
        y="0.603973"
        width="25.7218"
        height="3.89724"
        fill="black"
      />
    </svg>
  );
}
