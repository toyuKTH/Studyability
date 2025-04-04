export default function RankSVG({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height || "24px"}
      viewBox="0 -960 960 960"
      width={width || "24px"}
      fill="#000000"
    >
      <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
    </svg>
  );
}
