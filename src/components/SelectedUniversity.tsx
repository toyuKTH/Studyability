import { useAppSelector } from "../state/hooks";

function SelectedUniversity() {
    const currentUniversity = useAppSelector((state) => state.uniSelection.currentUniversity);
    return (<div>
        <h1>{currentUniversity?.name}</h1>
        <p>Start exploring now!</p>
    </div>);
}

export default SelectedUniversity;
