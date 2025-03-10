export default function CancelSVG({
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
      fill={fill || "black"}
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
}
