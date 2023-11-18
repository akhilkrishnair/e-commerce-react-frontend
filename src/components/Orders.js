import { Component } from "react";
import axios from "axios";   
import { Link } from "react-router-dom";




class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderProducts:null,
            checkedData:false
        }
    }


    componentDidMount(){
        this.fetchOrders();
    }

    fetchOrders(){
        axios.get('http://127.0.0.1:8000/api/orders/')
        .then((res)=>{
            this.setState({orderProducts:res.data})
            this.setState({checkedData:true})
            console.log(res.data)
        })
        .catch((error)=> {
            console.log(error)
            this.setState({checkedData:true})
        });
    };



    render() {
        return (
            <>
                <h4 className="text-center mb-5" >Orders</h4>
                {   
                    this.state.orderProducts&&
                    this.state.orderProducts.map((p)=>(                       
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
                                <p>Order ID : {p.order_id}</p>
                            </div>

                            <Link to={`/user/dashbord/orders/${p.order_id}/`} className="btn btn-primary h-25">
                                Details
                            </Link>
                      </div>
                    ))
                    
                }
                {
                    !this.state.checkedData&&
                    <h6>Loading .....</h6>
                }
                {
                    this.state.orderProducts&&this.state.orderProducts.length ===0&&
                    <h6>You have not ordered anything</h6>
                }
            </>
        );
    }
}

export default Orders;