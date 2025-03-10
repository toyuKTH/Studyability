export default function RemoveSVG({
  width,
  height,
  fill,
}: {
  width?: number;
  height?: number;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height || "24px"}
      viewBox="0 -960 960 960"
      width={width || "24px"}
      fill={fill || "#000000"}
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
}
