import { Component } from "react";
import axios from "axios";
import './css/Wishlist.css';
import { Link } from "react-router-dom";
import { access_token, baseUrl } from "../App";


class Wishlist extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wishlistProducts:null,
            checkedData:false,
         };
    }

    componentDidMount(){
        if(access_token){
            this.fetchWishlist();
        }
    }

    fetchWishlist = () => {
        axios.get(baseUrl+'wishlist/')
        .then((res)=>{
            this.setState({wishlistProducts:res.data})
            this.setState({checkedData:true})
            
        })
        .catch((error)=> {
            console.log(error)
            this.setState({checkedData:true})
        })
    };



    deleteWishlist(wishlist_id){
        axios.post(baseUrl+'wishlist/delete/',
        {wishlist_id:wishlist_id}
        )
        .then((res)=>{
            this.fetchWishlist();
        })
        .catch((error)=>{
            console.log(error)
        })
    };


    render() {
        return (
            <>
                <h4 className="text-center mb-5">Wishlist</h4>
                
                {   
                    this.state.wishlistProducts&&
                    this.state.wishlistProducts.map((p)=>(                       
                        <div key={p.id} className="wishlist-product-container">
                            <Link 
                            to={`/${p.product_variant.product_color_variant.product.category.slug}/${p.product_variant.product_color_variant.product.slug}/${p.product_variant.product_color_variant.color.name}/${p.product_variant.size.name}/`}
                            className="wishlist-product-image"
                            >
                               <div className="image">
                                   <img src={
                                    p.product_variant.product_color_variant.image1?
                                    p.product_variant.product_color_variant.image1:
                                    p.product_variant.product_color_variant.product.image_main
                                    } />
                               </div>
                            </Link>

                            <div className="wishlist-product-details">
                                <h6> 
                                    {
                                    p.product_variant.product_color_variant.product.name + "("+
                                    p.product_variant.product_color_variant.color.name+","+
                                    p.product_variant.size.name+")"
                                    }  
                                </h6>
                                
                                <h6>
                                    
                                        Rs.{
                                            p.product_variant.product_color_variant.product.orginal_price-
                                            p.product_variant.product_color_variant.product.orginal_price/100*p.product_variant.offer                                    
                                        }                                       
                                    
                                </h6>
                            </div>
                            <Link className="trash-btn-container" onClick={()=> this.deleteWishlist(p.id)} >
                                <i className="fa fa-trash fa-lg"></i>
                            </Link>
                      </div>
                         
                    ))
                    
                }

                {
                    !this.state.checkedData&&<h6>Loading .....</h6>                   
                }
                {
                    this.state.checkedData&&
                    this.state.wishlistProducts&&
                    this.state.wishlistProducts.length===0&&
                    <h6>you have no items in your wishlist</h6>
                }
            </>
            
        );
    }
}

export default Wishlist;