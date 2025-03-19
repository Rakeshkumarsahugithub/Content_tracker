import React from 'react';

const Filter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) =>
      checked
        ? [...prevFilters, value]
        : prevFilters.filter((platform) => platform !== value)
    );
  };

  return (
    <div className="filters">
      {['codeforces', 'codechef', 'leetcode'].map((platform) => (
        <div className="filter-item" key={platform}>
          <input
            type="checkbox"
            id={platform}
            value={platform}
            checked={filters.includes(platform)}
            onChange={handleChange}
          />
          <label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
