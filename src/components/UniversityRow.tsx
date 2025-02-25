import { useAppDispatch } from '../state/hooks';
import { IUniversity } from '../state/slices/dataSlice';
import {
  addUniToCompare,
  removeUniToCompare,
} from '../state/slices/uniSelectionSlice';

export default function UniversityRow({
  uni,
  isSelectedToCompare,
}: Readonly<{
  uni: IUniversity;
  isSelectedToCompare: boolean;
}>) {
  const dispatch = useAppDispatch();

  return (
    <tr className='university-list-item'>
      <td>
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
