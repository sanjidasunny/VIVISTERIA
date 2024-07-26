import React, { useState } from "react";

function Search({ setSearch }) {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="search container">
        <form className="d-flex justify-content-center">
          <input
            className="form-control me-2 bg-white"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchInput}
            onChange={handleInputChange}
          />

        </form>
      </div>
    </>
  );
}

export default Search;
