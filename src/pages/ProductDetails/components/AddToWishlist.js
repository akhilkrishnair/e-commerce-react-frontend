import { PureComponent } from "react";
import { token } from "intersepter/axios";
import { Link, NavLink } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { RiHeartAddFill } from "react-icons/ri";


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
            
        if(token){
            if(loaderAddWishlist){
                return <div className="add-to-wishlist-loader btn btn-danger p-2">
                            <div className=" loader-in-button "></div>
                        </div>
            }
            if(inWishlist){
                return <div className="add-to-wishlist">
                            <NavLink to={'/user/dashbord/wishlist/'} className="btn btn-danger p-3"><FaCheckCircle/> View Wishlist</NavLink>
                        </div>
            }
            return <div className="add-to-wishlist">
                        <button className="btn btn-danger p-3" onClick={()=> addToWishlist(singleProductId)} ><RiHeartAddFill/> Add to Wishlist</button>
                    </div>

        }
        return <div className="add-to-wishlist">
                    <Link to={'/user/login/'} className="btn btn-danger p-3" ><RiHeartAddFill/> Add to Wishlist</Link>
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