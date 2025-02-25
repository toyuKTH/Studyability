import { useAppDispatch, useAppSelector } from '../state/hooks';
import { IUniversity } from '../state/slices/dataSlice';
import {
  addUniToCompare,
  removeUniToCompare,
  setCurrentUniversity,
} from '../state/slices/uniSelectionSlice';

export default function UniversityRow({
  uni,
  isSelectedToCompare,
}: Readonly<{
  uni: IUniversity;
  isSelectedToCompare: boolean;
}>) {
  const dispatch = useAppDispatch();

  const currentUniversity = useAppSelector(
    (state) => state.uniSelection.currentUniversity
  );

  const isCurrentUniversity = Object.is(currentUniversity, uni);

  return (
    <tr className='university-list-item'>
      <td
        className='university-list-label'
        onClick={
          isCurrentUniversity
            ? () => dispatch(setCurrentUniversity(null))
            : () => dispatch(setCurrentUniversity(uni))
        }
      >
        {uni.name}, <strong>{uni.countryName}</strong>
      </td>
      <td>
        <input
          type='checkbox'
          onChange={
            isSelectedToCompare
              ? () => dispatch(removeUniToCompare(uni))
              : () => dispatch(addUniToCompare(uni))
          }
          name='selectUniToCompare'
          checked={isSelectedToCompare}
        />
      </td>
    </tr>
  );
}
