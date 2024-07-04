import React from 'react';
export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebar-content">
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
                    <span className="fs-4">Sidebar</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <a href="/" className="nav-link" aria-current="page">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home"></use></svg>
                            Home
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#speedometer2"></use></svg>
                            Dashboard
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#table"></use></svg>
                            Orders
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#grid"></use></svg>
                            Products
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle"></use></svg>
                            Customers
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}