import { PureComponent } from "react";
import { accessToken } from "intersepter/axios";
import { Link, NavLink } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";


class AddToWishlist extends PureComponent {
    constructor(props) {
        super(props);
    }

    renderWishlistcomponents = () => {
        const {
            inWishlist,
            loaderAddWishlist,
            addToWishlist,
            singleProductId} =  this.props
            
        if(accessToken){
            if(loaderAddWishlist){
                return <div className="add-to-wishlist-loader btn btn-primary">
                            <div className=" loader-in-button "></div>
                        </div>
            }
            if(inWishlist){
                return <div className="add-to-wishlist">
                            <NavLink to={'/user/dashbord/wishlist/'} className="btn btn-primary p-3"><FaCheckCircle/> &nbsp; View Wishlist</NavLink>
                        </div>
            }
            return <div className="add-to-wishlist">
                        <button className="btn btn-primary p-3" onClick={()=> addToWishlist(singleProductId)} >Add to Wishlist</button>
                    </div>

        }
        return <div className="add-to-wishlist">
                    <Link to={'/user/login/'} className="btn btn-primary p-3" >Add to Wishlist</Link>
                </div>  
    }


    render() {
        return (
            <>
            {this.renderWishlistcomponents()}
            </>
        );
    }
}

export default AddToWishlist;