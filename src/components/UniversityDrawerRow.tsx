import { useAppDispatch } from "../state/hooks";
import { IUniversity } from "../state/slices/dataSlice";
import { removeUniToCompare } from "../state/slices/uniSelectionSlice";
import SubstractSVG from "./svg/SubstractSVG";
import "./UniversityDrawerRow.css";

export default function UniversityDrawerRow({
  uni,
}: Readonly<{ uni: IUniversity }>) {
  const dispatch = useAppDispatch();

  return (
    <div className="uni-drawer-row">
      <div className="uni-drawer-name">{uni.name}</div>
      <button
        onClick={() => {
          dispatch(removeUniToCompare(uni));
        }}
        className="uni-drawer-remove"
      >
        <SubstractSVG width={20} />
      </button>
    </div>
  );
}
