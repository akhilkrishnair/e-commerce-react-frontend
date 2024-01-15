import axios from "axios";
import { PureComponent } from "react";
import { NavLink, useParams } from "react-router-dom";
import './css/product_details.css';

class Product_Details extends PureComponent {
    
    constructor(props){
        super(props)
        this.state = {
            allProducts:[],
            singleProduct:[],
            colorVariant:[],
            sizeVariant:[],
            inCart:false,
            inWishlist:false,
            csrf_token:"",
            currentUser:false,
            cartCount:null,
        };
    };

    componentDidMount(){
        this.fetchUser();
        this.fetchProduct();
        this.setState({csrf_token:this.getCookie("csrftoken")});

    };


    componentDidUpdate(prevValue){
        if (this.props !== prevValue){           
            this.filterProductVariant();
        };
        console.log(prevValue, this.props)
    }; 

    fetchUser(){
        axios.get('http://127.0.0.1:8000/api/user/profile/',
        ).then((res) => {
            this.setState({currentUser:true})
        }).catch((error) => {
            this.setState({currentUser:false})
        })

    };

    filterProductVariant(){
        const {slug,color,size} = this.props;
        const singleProduct = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color && 
                    p.size.name === size
        });
        this.setState({singleProduct:singleProduct});

        const colorVariant = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.size.name === size                   
        }).sort();
        this.setState({colorVariant:colorVariant});

        const sizeVariant = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color                  
        }).sort((a,b) => a.size.name[0]-b.size.name[0]) ;
        this.setState({sizeVariant:sizeVariant});
    };

    
    fetchProduct(){
        axios
        .get('http://127.0.0.1:8000/api/product-variants/')
        .then((response) => {
            this.setState({allProducts:response.data});
            this.filterProductVariant();

        })
        .catch((error) => {
            console.log("eerroorr "+error)
        });
    };

    changeImage(e){
        let current_img = document.getElementsByClassName("current-image")[0].children[0]       
        current_img.src = e.target.src   
    };
  
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

   

    
    addToCart(product_variant_id){
        const addCartData = {
            product_variant:product_variant_id,
        };
    
        axios.post('http://127.0.0.1:8000/api/cart/add-cart/',
        addCartData,
        {
            headers:{
                'X-CSRFToken':this.state.csrf_token,               
            },        
        }
        )
        .then((res)=>{
            this.fetchCart();
            this.props.cartCount();
        })
        .catch((error)=>{
            console.log(error.response.data[0])
        })

    };


    addToWishlist(product_variant_id){
       
        const wishlistData = {            
            product_variant:product_variant_id,
        };
    
        axios.post('http://127.0.0.1:8000/api/wishlist/add?search_param=hello im searching',
        wishlistData,
        {
            headers:{
                'X-CSRFToken':this.state.csrf_token
            }
        }
        
        ).then((res)=>{
            console.log(res)
            this.fetchWishlist()
        }).catch((err) => {
            console.log(err)
        })
    };


    fetchCart(){
        const {singleProduct} = this.state
        
        axios.post('http://127.0.0.1:8000/api/cart/in-cart/',
            {
                product_variant:singleProduct[0]&& singleProduct[0].id
            },{
                headers:{
                    'X-CSRFToken':this.state.csrf_token
                }
            }
        )
        .then((res)=>{
            this.setState({inCart:res.data.incart});
           
        }).catch((error)=>{
            console.log(error)
        });
    };


    fetchWishlist(){
        const {singleProduct} = this.state
        
        axios.post('http://127.0.0.1:8000/api/wishlist/in-wishlist/',
            {
                product_variant:singleProduct[0]&& singleProduct[0].id
            },{
                headers:{
                    'X-CSRFToken':this.state.csrf_token
                }
            }
        )
        .then((res)=>{
            this.setState({inWishlist:res.data.in_wishlist});
           
        }).catch((error)=>{
            console.log(error)
        });
    };



    
    render() {
        if(this.state.currentUser){
            this.fetchCart()
            this.fetchWishlist()
        }
        

        return (
            <>               
                <div className="product-main-container mt-5">
                    
    
                    
                    {
                        this.state.singleProduct.length===0&&<h4 className="text-center" >Loading .....</h4>
                    }
                {   
                    this.state.singleProduct && this.state.singleProduct.map((p) => (
                        
                           <>
                                <div key={p.id} className="product-image-container">
                                    <div className="current-image">
                                        <img 
                                           src={
                                            p.product_color_variant.image1?
                                            p.product_color_variant.image1:
                                            p.product_color_variant.product.image_main
                                           }
                                           alt={p.product_color_variant.product.slug}
                                        />
                                    </div>
                                    <div className="available-images">
                                        {
                                            p.product_color_variant.image1?
                                            <div  className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image1
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image2?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image2
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image3?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image3
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image4?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image4
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image5?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image5
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image6?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image6
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }
                                        {
                                            p.product_color_variant.image7?
                                            <div className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image7
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </div>:null
                                        }

                                    </div>
                                </div>
                                <div className="product-details-container">
                                    <h5>
                                        {   
                                            p.product_color_variant.color.name !== 'no-color'?
                                            p.product_color_variant.product.name +" ("+                        
                                            p.product_color_variant.color.name+", "+
                                            p.size.name+")":
                                            
                                            p.product_color_variant.product.name +" ("+                                     
                                            p.size.name+")"
                     
                                        }
                                    </h5>
                                    <br/>
                                    <h6  >Rs.
                                        {
                                            p.price-
                                            p.price/100*p.offer
                                        }
                                        <span className="ms-4 text-secondary text-decoration-line-through" >Rs.{p.price}</span>
                                        <span className="ms-4 text-success">{p.offer}% off</span>
                                    </h6>
                                    <br/><br/><br/>
  

                             {/* variant selection section starts */}
                                    <div className="product-variant-selection">


                                       { p.product_color_variant.color.name !=="no-color"&&
                                        <div className="color-selection">
                                            <h6 className="me-4">Colors available : </h6>
                                            {
                                                this.state.colorVariant && this.state.colorVariant.map((cv => (
                                                    <NavLink className="color-variant" key={cv.id} value={cv.product_color_variant.color.name} to={
                                                        `/${cv.product_color_variant.product.category.slug}/${cv.product_color_variant.product.slug}/${cv.product_color_variant.color.name}/${cv.size.name}/`
                                                        } >
                                                        <img 
                                                        src={
                                                            cv.product_color_variant.image1?
                                                            cv.product_color_variant.image1:
                                                            cv.product_color_variant.product.image_main
                                                        }
                                                        alt={p.product_color_variant.product.slug} 
                                                        />
                                                    </NavLink>
                                                )))
                                            }

                                        </div>
                                        }


                                        <div className="size-selection">
                                            <h6 className="me-4">Size available : </h6>
                                            {
                                                this.state.sizeVariant && this.state.sizeVariant.map((sv => (
                                                    <NavLink className="size-variant" key={sv.id}
                                                    to={
                                                        `/${sv.product_color_variant.product.category.slug}/${sv.product_color_variant.product.slug}/${sv.product_color_variant.color.name}/${sv.size.name}/`
                                    
                                                    }
                                                    >
                                                        {sv.size.name}
                                                    </NavLink>
                                                )))

                                            }

                                        </div>

                                    </div>

                                    <div className="add-to-cart-add-to-wishlist-container">

                                        {
                                            this.state.currentUser?
                                            <>
                                                {
                                                    this.state.inCart?
                                                        <div className="add-to-cart me-3">
                                                            <NavLink to={'/user/cart/'} className="btn btn-success" >&#x2714; &nbsp; View Cart</NavLink>
                                                        </div>:
                                                        
                                                        <div className="add-to-cart me-3">
                                                            <button className="btn btn-success" onClick={()=> this.addToCart(p.id)} >Add to Cart</button>
                                                        </div> 
                                                        
                                                                          
                                                }
                                            </>
                                            :
                                            <div className="add-to-cart me-3">
                                                <button className="btn btn-success" >Add to Cart</button>
                                            </div>                    

                                        }

                                        { 
                                            this.state.currentUser?
                                                <>
                                                    {
                                                        this.state.inWishlist?
                                                        <div className="add-to-wishlist">
                                                            <NavLink to={'/user/dashbord/wishlist/'} className="btn btn-primary">&#x2714; &nbsp; View Wishlist</NavLink>
                                                        </div>:
                                                        <div className="add-to-wishlist">
                                                            <button className="btn btn-primary" onClick={()=> this.addToWishlist(p.id)} >Add to Wishlist</button>
                                                        </div>                                
                                                    }
                                                </>:
                                                    <div className="add-to-wishlist">
                                                        <button className="btn btn-primary" >Add to Wishlist</button>
                                                    </div>                                                                               
                                           
                                        }
                                            

                                    </div>

                                </div>
                            </>
                           ))
                           
                        }
            
              </div>
              <hr/>
              <div className="product-description-container mt-5" >
                <h5 className="text-center">Product Description</h5>
                
                    <div className="container mt-4">
                    {
                        this.state.singleProduct[0]&& 
                        this.state.singleProduct[0].product_color_variant.product.description
                    }
                        
                    </div>
            
              </div>

            </>
        );
    };
};

function UserDetailWrapper({cart_counter}) {
    const { category,slug,color,size } = useParams();
    return <Product_Details cartCount={cart_counter} category={category} slug={slug} color={color} size={size} />;
};
  
export default UserDetailWrapper;

