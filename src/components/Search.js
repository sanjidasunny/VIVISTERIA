import React, { useState } from 'react'

function Search({setSearch}) {
    const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value); 
  };

    
    return (
        <div className='search'>
            <form className="d-flex bg-dark justify-content-center">
                <input
                    className="form-control me-2 bg-dark text-white"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchInput}
                    onChange={handleInputChange}
                />
                {/*<button
                    className="btn btn-success text-white"
                    type="submit"
                >
                    Search
                </button>*/}
            </form>

        </div>
    )
}

export default Search
