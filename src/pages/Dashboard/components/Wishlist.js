import { Component } from "react";
import './Wishlist.css';
import { Link } from "react-router-dom";
import {axiosWithAuthentication} from "intersepter/axios";
import { deleteWishlistProduct } from "api/wishlist";
import { renderProductName, renderProductPrice } from "utils/productUtills";
import { FaTrashAlt } from "react-icons/fa";


class Wishlist extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wishlistProducts:null,
            checkedData:false,
         };
    }

    componentDidMount(){
        this.fetchWishlist();
    }

    fetchWishlist = () => {
        axiosWithAuthentication
        .get('wishlist/')
        .then((res)=>{
            this.setState({wishlistProducts:res.data})
            this.setState({checkedData:true})         
        })
        .catch((error)=> {
            this.setState({checkedData:true})
        })
    };

    deleteWishlist(event, wishlist_id){
        event.currentTarget.childNodes[1].hidden =  true
        event.currentTarget.childNodes[0].hidden =  false
        deleteWishlistProduct({id:wishlist_id})
        .then((res)=>{
            this.fetchWishlist();
        })
        .catch((error)=>{ console.log(error)})
    };


    render() {
        const {wishlistProducts, checkedData} = this.state
        return (
            <>
                <h4 className="text-center mb-5">Wishlist</h4>
                
                {   
                    wishlistProducts&&
                    wishlistProducts.map((p)=>(                       
                        <div key={p.id} className="wishlist-product-container">
                            <Link 
                            to={`/${p.product_variant.product_color_variant.product.category.slug}/${p.product_variant.product_color_variant.product.slug}/${p.product_variant.product_color_variant.color.name}/${p.product_variant.size.name}/${p.product_variant.product_color_variant.product.id}/`}
                            className="wishlist-product-image"
                            >
                               <div className="image">
                                   <img src={
                                            p.product_variant.product_color_variant.image1?
                                            p.product_variant.product_color_variant.image1:
                                            p.product_variant.product_color_variant.product.image_main
                                        } 
                                        alt="wishilist-product.jpg"
                                    />
                               </div>
                            </Link>

                            <div className="wishlist-product-details">
                                <h6>{renderProductName({product:p.product_variant})}</h6>
                                
                                {renderProductPrice(p.product_variant)}
                            </div>
                            <div className="wishlist-product-delete-btn-container"
                                onClick={(event)=> this.deleteWishlist(event,p.id)}>

                                <div id={'wishlist-delete-loader-'+p.id} hidden={true} className="wishlist-delete-loader" ></div>
                                <div><FaTrashAlt /></div> 
                            </div>
                      </div>
                         
                    ))
                    
                }

                {!checkedData&&<h6>Loading .....</h6>}

                { checkedData&&
                    wishlistProducts&&
                    wishlistProducts.length===0&&
                    <h6>you have no items in your wishlist</h6>}
            </>
            
        );
    }
}

export default Wishlist;