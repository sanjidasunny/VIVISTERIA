import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          <img src='/bhoj-black.png' style={{ height: "60px", width: "60px" }} alt="Bhoj" />
        </Link>
        <span className="mb-3 mb-md-0 text-muted">© 2024 Bhoj, Inc</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <Link to="https://github.com/AsifAvaas" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github fa-2x"></i>
          </Link>
        </li>
       
        <li className="ms-3">
          <Link to="https://github.com/sanjidasunny" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-square-github fa-2x"></i>
          </Link>
        </li>
      </ul>
    </footer>

  )
}

export default Footer
