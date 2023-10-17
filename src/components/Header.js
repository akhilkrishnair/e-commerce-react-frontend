import { Component } from "react";


class Header extends Component {
     
    render() { 
        return (
            <div className="header-section">
                    <nav className="navbar bg-primary navbar-expand-lg " data-bs-theme="dark" >
                        <div className="container-fluid">
                            <h3><a className="navbar-brand mx-5" href="#">E-Shop</a></h3>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse ms-3" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                
                                <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    My Account
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                                </li>
                            </ul>
                            <form className="d-flex" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button className="btn btn-outline-light" type="submit">Search</button>
                            </form>
                            </div>
                        </div>

                    </nav>
            </div>
        );
    }
}
 
export default Header;