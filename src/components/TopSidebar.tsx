import { useAppSelector } from "../state/hooks";
import SelectedUniversity from "./SelectedUniversity";
import WelcomeBox from "./WelcomeBox";

function TopSidebar() {
    const currentUniversity = useAppSelector((state) => state.uniSelection.currentUniversity);
    return (
        <div className="top-sidebar-container">
            {currentUniversity==null && <WelcomeBox/>}
            {currentUniversity!=null && <SelectedUniversity/>}
        </div>
    );
}

export default TopSidebar;
