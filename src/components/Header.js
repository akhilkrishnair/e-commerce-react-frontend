import axios from "axios";
import React,{ Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser : false,
            email:""
        }
    }

    componentDidMount (){
        axios.get('http://127.0.0.1:8000/api/user/profile/',
        ).then((res) => {
            this.setState({currentUser:true})
            this.setState({email:res.data.email})
        }).catch((res) => {
            this.setState({currentUser:false})
        })
    }
    

    logOutReq = ()=>{
        axios.get('http://127.0.0.1:8000/api/user/logout/')
        .then((res) => {
            this.setState({currentUser:false})
            window.location.href = '/'
        }).catch((res) =>{
           console.log(res)
        });
    }


     
    render() { 
        return (
            <div className="header-section">
                    <nav className="navbar bg-primary navbar-expand-lg " data-bs-theme="dark" >
                        <div className="container-fluid">
                            <h3><Link className="navbar-brand mx-5" to={"/"}>E-Shop</Link></h3>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse ms-3" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to={'/'} >Home</Link>
                                </li>
                                
                                <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    User
                                </a>
                                <ul className="dropdown-menu">
                                    {
                                        this.state.currentUser?
                                            <>
                                                <li><Link className="dropdown-item" >Hi {this.state.email}</Link></li>
                                                <li><Link className="dropdown-item" onClick={this.logOutReq} >Log out</Link></li>
                                                <li><Link className="dropdown-item" to={'/user/dashbord/'} >Wishlist</Link></li>

                                            </>:
                                            <>
                                                <li><Link className="dropdown-item" to={"/user/registration"} >Register</Link></li>
                                                <li><Link className="dropdown-item"  to={"/user/login/"}>Log in</Link></li>
                                            </>
                                        
                                    }
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><Link className="dropdown-item" href="#">Something else here</Link></li>
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