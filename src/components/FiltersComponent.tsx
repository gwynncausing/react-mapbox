import { useEffect, useState } from 'react';
import { useFetchMock } from '../hooks/useFetchMock';
import { LGA } from '../types';

interface FiltersComponentProps {
    handleFiltersChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FiltersComponent = ({handleFiltersChange}: FiltersComponentProps) => {
  const [lgas, setLgas] = useState<LGA[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const newLgas: LGA[] = await useFetchMock({
        route: "/lgas",
      }) as LGA[];
      console.log(newLgas);
      setLgas(newLgas)
    }

    fetchData();
  })

  return (
    <div className='filter-wrapper'>
      <select data-test="filters" name="filters" id="filters" onChange={handleFiltersChange}>
        <option value="">Filter by Location</option>
        {lgas?.map(item => (
          <option value={item.code} key={item.code}>{item.long_name}</option>
        ))}
      </select>
    </div>
  );
};

export default FiltersComponent;
