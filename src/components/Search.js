import React from 'react'

function Search() {
    return (
        <div className='search'>
            <form className="d-flex bg-dark">
                <input
                    className="form-control me-2 bg-dark text-white"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                />
                <button
                    className="btn btn-success text-white"
                    type="submit"
                >
                    Search
                </button>
            </form>

        </div>
    )
}

export default Search
