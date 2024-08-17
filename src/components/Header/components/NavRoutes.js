import { CartContext, UserContext } from "contexts/contexts";
import { PureComponent } from "react";
import { FaHome, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

class NavRoutes extends PureComponent {
    constructor(props) {
        super(props);
    }

    renderUnAuthorizedLinks = (value) => {
        if(value){
            return  <>
                    <li className="nav-item text-light ms-1">
                        <Link className="nav-link active" to={'/user/dashbord/profile/'} > <FaUser className="fs-5" /> </Link>
                    </li> 
                    <li className="nav-item ms-1">
                        <Link className="nav-link active" aria-current="page" to={'/'} ><FaHome className="fs-5" /></Link>
                    </li>
                    <li className="nav-item ms-1">
                    <Link className="nav-link active" aria-current="page" to={'/user/cart/'} >                                           
                            <span className="" >
                                <FaShoppingBag className="fs-5" /> 

                                <CartContext.Consumer>
                                    {({cartCount}) => cartCount>0&&<span className="header-cart-icon">{cartCount}</span>}
                                </CartContext.Consumer>
                            </span> 
                        </Link>
                    </li>
                    </>
        }
        return  <>
                <li className="nav-item dropdown">
                    <span className="nav-link active dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <FaUser className="fs-5" /> 
                    </span>
                                                        
                    <ul className='dropdown-menu'>                   
                        <li><Link className="dropdown-item" to={"/user/registration"} >Register</Link></li>
                        <li><Link className="dropdown-item"  to={"/user/login/"}>Log in</Link></li>                                   
                    </ul>
                </li>    
                <li className="nav-item ms-1">
                    <Link className="nav-link active" aria-current="page" to={'/'} ><FaHome className="fs-5" /></Link>
                </li>
                </>
    }


    render() {
        return (
            <ul className="ms-4 navbar-nav me-auto mb-2 mb-lg-0">
                <UserContext.Consumer>
                    {(value) => this.renderUnAuthorizedLinks(value)}
                </UserContext.Consumer>
            </ul>
        );
    }
}

export default NavRoutes;