import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  return (
    <div className="flex items-center mb-6">
      <input
        type="text"
        placeholder="Search by email, name..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="w-full px-4 py-2 border border-gray-400 rounded-md font-poppins focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
      />
      <button
        onClick={handleSearch}
        className="ml-2 px-4 py-2 bg-[#C84B31] text-white rounded-md font-poppins font-bold transition-all duration-300 ease-in-out hover:bg-[#a84028]"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
