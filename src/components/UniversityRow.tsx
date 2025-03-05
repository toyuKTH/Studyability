import { ChangeEvent, MouseEvent } from "react";
import { IUniversity } from "../state/slices/dataSlice";

export default function UniversityRow({
  uni,
  isSelectedToCompare,
  selected,
  onClick,
  onToggleCheckbox,
}: Readonly<{
  uni: IUniversity;
  isSelectedToCompare: boolean;
  selected: boolean;
  onClick?: (e: MouseEvent<HTMLTableRowElement>) => void;
  onToggleCheckbox?: (e: ChangeEvent<HTMLInputElement>) => void;
}>) {
  return (
    <tr
      className={`university-list-item ${
        selected ? "university-selected" : ""
      }`}
      onClick={onClick}
    >
      <td className="university-list-label">
        <div className="university-name">
          #{uni.rank} {uni.name}
        </div>
        <div className="university-location">
          {uni.city}, {uni.countryName}
        </div>
      </td>
      <td>
        <input
          type="checkbox"
          onChange={onToggleCheckbox}
          onClick={(e) => e.stopPropagation()}
          name="selectUniToCompare"
          checked={isSelectedToCompare}
        />
      </td>
    </tr>
  );
}
