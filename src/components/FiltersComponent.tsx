import lgas from '../assets/lgas.json'

interface FiltersComponentProps {
    handleFiltersChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FiltersComponent = ({handleFiltersChange}: FiltersComponentProps) => {
  return (
    <div className='filter-wrapper'>
      <select data-test="filters" name="filters" id="filters" onChange={handleFiltersChange}>
        <option value="">Filter by Location</option>
        {lgas.map(item => (
          <option value={item.code} key={item.code}>{item.long_name}</option>
        ))}
      </select>
    </div>
  );
};

export default FiltersComponent;
