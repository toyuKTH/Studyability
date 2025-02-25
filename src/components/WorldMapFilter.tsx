import { useAppSelector } from '../state/hooks';
import { getFilteredData, IUniversity } from '../state/slices/dataSlice';
import UniversityRow from './UniversityRow';
import './WorldMapFilter.css';

export default function WorldMapFilter() {
  let { filteredUniversities } = useAppSelector(getFilteredData);
  const currentUniversity = useAppSelector(
    (state) => state.uniSelection.currentUniversity
  );
  const uniToCompare = useAppSelector(
    (state) => state.uniSelection.uniToCompare
  );
  let isCurrentUniSelected = false;

  if (uniToCompare.length > 0) {
    filteredUniversities = [...filteredUniversities].filter((uni) => {
      return uniToCompare.indexOf(uni) === -1;
    });
    if (currentUniversity != null) {
      isCurrentUniSelected = uniToCompare.indexOf(currentUniversity) !== -1;
    }
  }

  const mapUniversityRow =
    (isSelectedToCompare: boolean) => (uni: IUniversity, index: number) => {
      return (
        <UniversityRow
          uni={uni}
          isSelectedToCompare={isSelectedToCompare}
          key={`uni-${index}`}
        />
      );
    };

  const mapCurrentUniversity = mapUniversityRow(isCurrentUniSelected);

  return (
    <div
      className='filtering-list-container'
      style={currentUniversity != null ? { minHeight: '40%' } : {}}
    >
      <div className='map-filtering-title'>
        <h2>University List</h2>
      </div>
      <div className='map-filtering-body'>
        <table>
          <tbody>
            {currentUniversity != null &&
              mapCurrentUniversity(currentUniversity, 0)}
            {currentUniversity == null &&
              uniToCompare.length > 0 &&
              uniToCompare.map(mapUniversityRow(true))}
            {currentUniversity == null &&
              filteredUniversities.map(mapUniversityRow(false))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
