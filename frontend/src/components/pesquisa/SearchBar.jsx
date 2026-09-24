import { useState } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, placeholder = "Buscar por nome..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="search-container mb-3">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="custom-search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <button 
          type="button" 
          className="clear-btn" 
          onClick={handleClear}
          title="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}