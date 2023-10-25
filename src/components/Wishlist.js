import { Component } from "react";
import axios from "axios";
import './css/Wishlist.css';

class Wishlist extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wishlistProducts:[]
         };
    }

    componentDidMount(){
        this.fetchWishlist();
    }

    fetchWishlist(){
        axios.get('http://127.0.0.1:8000/api/wishlists/',
        {withCredentials:true}
        )
        .then((res)=>{
            this.setState({wishlistProducts:res.data})
            console.log(res.data)
        })
        .catch((error)=> {
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
                            <div className="wishlist-product-image">
                               <div className="image">
                                   <img src={
                                    p.product_variant.product_color_variant.image1?
                                    p.product_variant.product_color_variant.image1:
                                    p.product_variant.product_color_variant.product.image_main
                                    } />
                               </div>
                            </div>

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
                      </div>
                    ))
                    
                }
            </>
            
        );
    }
}

export default Wishlist;