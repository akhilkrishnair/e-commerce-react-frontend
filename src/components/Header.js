import axios from "axios";
import React,{ Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentUser : false,
            email:"",
            first_name:"",
            last_name:"",
        }
    }

    componentDidMount (){
        axios.get('http://127.0.0.1:8000/api/user/profile/',
        ).then((res) => {
            this.setState({currentUser:true})
            this.setState({email:res.data.email})
            this.setState({first_name:res.data.first_name})
            this.setState({last_name:res.data.last_name})

        }).catch((res) => {
            this.setState({currentUser:false})
        })
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
                            <ul className="ms-5 navbar-nav me-auto mb-2 mb-lg-0">
                                
                                <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dashbord
                                </a>
                                <ul className="dropdown-menu">
                                    {
                                        this.state.currentUser?
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" >Hi  
                                                        {
                                                            this.state.first_name && this.state.last_name?
                                                            " "+this.state.first_name+" "+this.state.last_name:
                                                            " "+this.state.email
                                                        }
                                                    </Link>
                                                </li>
                                                <li><Link className="dropdown-item" to={'/user/dashbord/profile/'} >Profile</Link></li>

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
                                <li className="nav-item ms-3">
                                <Link className="nav-link active" aria-current="page" to={'/'} >Home</Link>
                                </li>

                                {
                                    this.state.currentUser&&
                                        <li className="nav-item ms-3">
                                            <Link className="nav-link active" aria-current="page" to={'/user/cart'} >Cart</Link>
                                        </li>

                                }


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