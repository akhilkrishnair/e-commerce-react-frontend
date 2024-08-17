import { Component } from "react";
import './Header.css';
import { Link } from "react-router-dom";
import NavRoutes from "./components/NavRoutes";


class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchItems:"",
        };
    };   

    handleSearchProductInput =(e)=> {
        const {name,value} = e.target;
        this.setState({[name]:value});
    };
    
    handleSearchProductInputSend = () => {
        this.props.productSearch(this.state.searchItems)
    };

     
    render() {
        
        return (
            <div className="header-section">
                    <nav className="navbar bg-dark navbar-expand-lg " data-bs-theme="dark" >
                        <div className="container-fluid">
                            <h3>
                                <Link className="navbar-brand mx-5" to={"/"} >
                                    E-Shop
                                </Link>
                            </h3>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse ms-4" id="navbarSupportedContent">

                               {/* Navlinks component */}
                               <NavRoutes />

                                <div className="d-flex col-lg-6" role="search">
                                    <input className="form-control me-2 border-light" name="searchItems" 
                                    type="search" placeholder="Search products" aria-label="Search"
                                    onChange={this.handleSearchProductInput}
                                    />
                                    <Link 
                                        className="btn btn-outline-light" 
                                        type="submit"
                                        onClick={this.handleSearchProductInputSend}
                                        to={`/search/?query=${this.state.searchItems}`}>Search</Link>
                                </div>

                            </div>
                        </div>
                    </nav>
            </div>
        );
    }
}


export default Header;