import axios from "axios";
import { Component } from "react";
import { Link } from "react-router-dom";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            cartChecked: false,
            csrf_token:"",
        };
    }

    componentDidMount() {
        this.fetchCart();
        this.setState({csrf_token:this.getCookie('csrftoken')})
    }

    fetchCart() {
        axios
            .get("http://127.0.0.1:8000/api/cart/")
            .then((res) => {                
                this.setState({ cart: res.data });
                this.setState({ cartChecked: true });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ cartChecked: true });
            });
    }

    getCookie (cookieName){
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
      
          // Check if the cookie starts with the specified name
          if (cookie.startsWith(cookieName + '=')) {
            // Return the value of the cookie
            return cookie.substring(cookieName.length + 1);
          }
        }
      
        // Return null if the cookie is not found
        return null;
    };
   

    increamentCart(cart_id,product_variant_id){
        
        axios.post('http://127.0.0.1:8000/api/cart/increament-qty/',
         {
           cart_id:cart_id,
           product_variant_id:product_variant_id,  
         },
         {
            headers:{
                'X-CSRFToken':this.state.csrf_token
            }
         }
        ).then((res)=>{
            console.log(res)
            this.fetchCart()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    decreamentCart(cart_id){       
        axios.post('http://127.0.0.1:8000/api/cart/decreament-qty/',
         {
           cart_id:cart_id,
         },
         {
            headers:{
                'X-CSRFToken':this.state.csrf_token
            }
         }
        ).then((res)=>{
            console.log(res)
            this.fetchCart()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    deleteCart(cart_id){       
        axios.post('http://127.0.0.1:8000/api/cart/delete-cart/',
         {
           cart_id:cart_id,
         },
         {
            headers:{
                'X-CSRFToken':this.state.csrf_token
            }
         }
        ).then((res)=>{
            console.log(res)
            this.fetchCart()
            this.props.cart_counter();
        })
        .catch((err)=>{
            console.log(err)
        })
    }


    render() {
        return (
            <div className="cart-main-container">
                {!this.state.cartChecked && <h6 className="text-center">Loading .....</h6>}
                
                {this.state.cartChecked&&this.state.cart.length >0&&
                <div className="each-cart-container">
                    <section className="h-100" style={{ backgroundColor: "#eee" }}>
                        <div className="container h-100 py-5">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="col-10">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>
                                        <div>
                                            <p className="mb-0">
                                                <span className="text-muted">Sort by:</span>{" "}
                                                <a href="#!" className="text-body">
                                                    price <i className="fas fa-angle-down mt-1"></i>
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    {
                                        this.state.cart.map((cp) => (
                                            <div className="card rounded-3 mb-4">
                                                <div className="card-body p-4">
                                                    <div className="row d-flex justify-content-between align-items-center">
                                                        <Link 
                                                        to={        
                                                            `/${cp.product_variant.product_color_variant.product.category.slug}/${cp.product_variant.product_color_variant.product.slug}/${cp.product_variant.product_color_variant.color.name}/${cp.product_variant.size.name}/`
                                                            }

                                                        className=" col-md-2 col-lg-2 col-xl-2">
                                                            <img
                                                                src={
                                                                    cp.product_variant.product_color_variant.image1?
                                                                    cp.product_variant.product_color_variant.image1:
                                                                    cp.product_variant.product_color_variant.product.image_main
                                                                }
                                                                className="img-fluid rounded-3 w-75"
                                                                alt={"Cotton T-shirt"}
                                                            />
                                                        </Link>
                                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                                            <p className=" fw-normal mb-2">
                                                                {
                                                                    `${cp.product_variant.product_color_variant.product.name}`
                                                                }
                                                            </p>
                                                            <p>
                                                                <span className="text-muted">Size: </span>{cp.product_variant.size.name}<br/>
                                                                <span className="text-muted">Color: </span>{cp.product_variant.product_color_variant.color.name}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                            {
                                                                cp.quantity>1&&
                                                                    <button onClick={()=> this.decreamentCart(cp.id)} className="btn btn-link px-2">
                                                                        <i className="fa fa-minus"></i>
                                                                    </button>                        
                                                            }
                                                            <label
                                                                id="form1"
                                                                    
                                                                className="form-control form-control-sm text-center w-25"
                                                            >{cp.quantity}</label>

                                                            <button onClick={()=> this.increamentCart(cp.id,cp.product_variant.id)} className="btn btn-link px-2">
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                            <h6 className="mb-0">
                                                                Rs.
                                                                {
                                                                    cp.product_variant.product_color_variant.product.orginal_price-
                                                                    cp.product_variant.product_color_variant.product.orginal_price/100*cp.product_variant.offer
                                                                }
                                                            </h6>
                                                        </div>
                                                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                                            <Link onClick={()=>this.deleteCart(cp.id)} className="text-danger">
                                                                <i className="fa fa-trash fa-lg"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    <div className="card mb-4">
                                        <div className="card-body p-4 d-flex flex-row">
                                            <div className="form-outline flex-fill">
                                                <input type="text" id="form1" className="form-control form-control-lg" />
                                                <label className="form-label" for="form1">
                                                    Discound code
                                                </label>
                                            </div>
                                            <button type="button" className="btn btn-outline-warning btn-lg ms-3">
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <Link to={'/user/order/checkout/'} className="btn btn-warning btn-block btn-lg">
                                                Proceed to Pay
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                }

                {this.state.cartChecked && this.state.cart.length === 0 && (
                    <Link to={"/"} className="empty-cart">
                        <h6 className="bg-primary p-4 text-white text-center w-50 mx-auto my-5">
                            You have not added anything to cart! shop now
                        </h6>
                    </Link>
                )}
            </div>
        );
    }
}

export default Cart;
