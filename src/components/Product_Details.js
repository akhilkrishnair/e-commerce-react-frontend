import './css/product_details.css';
import axios from "axios";
import React ,{ PureComponent } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import {Swiper,SwiperSlide} from 'swiper/react';
import { Navigation,  Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { access_token,baseUrl } from '../App';

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
            currentUser:false,
            cartCount:null,
            loaderAddCart:false,
            loaderAddWishlist:false
        };
    };

    componentDidMount(){
        this.fetchProduct();
    };


    componentDidUpdate(prevProps,prevState){
        if (this.props !== prevProps){           
            this.filterProductVariant();
        };
        if (this.state !== prevState && access_token){
            this.fetchCart();
            this.fetchWishlist();
        };

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
        .get(baseUrl+'product-variants/')
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
  
    
    addToCart = (product_variant_id) => {
        this.setState({loaderAddCart:true})
        const addCartData = {
            product_variant:product_variant_id,
        };
    
        axios.post(baseUrl+'cart/add-cart/',
        addCartData
        )
        .then((res)=>{
            this.fetchCart();
            this.props.cartCount();
        })
        .catch((error)=>{
            console.log(error)
            this.setState({loaderAddCart:false})
        })
    };


    addToWishlist = (product_variant_id) => {
        this.setState({loaderAddWishlist:true})
        const wishlistData = {            
            product_variant:product_variant_id,
        };
    
        axios.post(baseUrl+'wishlist/add/',
        wishlistData        
        ).then((res)=>{
            this.fetchWishlist()
        }).catch((err) => {
            this.setState({loaderAddWishlist:false})
        })
    };


    fetchCart = async () =>{
        const {singleProduct} = this.state
        
        await axios.post(baseUrl+'cart/in-cart/',
            {product_variant:singleProduct[0]&& singleProduct[0].id}           
        )
        .then((res)=>{
            this.setState({inCart:res.data.incart});          
        }).catch((error)=>{
            console.log(error)
        }).then(() => {
            this.setState({loaderAddCart:false})
        });
    };


    fetchWishlist = async () => {
        const {singleProduct} = this.state
        
        await axios.post(baseUrl+'wishlist/in-wishlist/',
            { product_variant:singleProduct[0]&& singleProduct[0].id}
        )
        .then((res)=>{
            this.setState({inWishlist:res.data.in_wishlist});           
        }).catch((error)=>{
            console.log(error)
        }).then(()=>{
            this.setState({loaderAddWishlist:false})
        })
    };



    
    render() {       

        return (
            <>               
                <div className="product-main-container">   
                    
                    {
                        this.state.singleProduct.length===0&&
                        <div className=" loader-element" >
                            <div className='loader'></div>
                        </div>
                    }
                {   
                    this.state.singleProduct && this.state.singleProduct.map((p) => (
                        
                           <React.Fragment key={p.id}>
                                <div  className="product-image-container">
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

                                    <Swiper className="available-images"
                                            direction={'vertical'}
                                            cssMode={true}
                                            slidesPerView={5}
                                            loop={false}
                                            navigation={true}
                                            modules={[Navigation, Mousewheel]}
                                            >
                                        {
                                            p.product_color_variant.image1?
                                            <SwiperSlide  className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image1
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image2?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image2
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image3?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image3
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image4?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image4
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image5?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image5
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image6?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image6
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }
                                        {
                                            p.product_color_variant.image7?
                                            <SwiperSlide className="img">
                                            <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                                src={
                                                    p.product_color_variant.image7
                                                }
                                                alt={p.product_color_variant.product.slug}
                                            />
                                            </SwiperSlide>:null
                                        }

                                    </Swiper>

                                      {/* add to cart add to wishlist button section starts */}
                                    <div className="add-to-cart-add-to-wishlist-container">

                                        {
                                            access_token?
                                            <>
                                                 {
                                                    this.state.loaderAddCart?
                                                    <div className="add-to-cart-loader btn btn-success">
                                                        <div className=" loader-in-button "></div>
                                                    </div>:  
                                                    this.state.inCart?
                                                    <div className="add-to-cart ">
                                                        <NavLink to={'/user/cart/'} className="btn btn-success p-3" >&#x2714; &nbsp; View Cart</NavLink>
                                                    </div> :
                                                    <div className="add-to-cart ">
                                                        <button className="btn btn-success p-3" onClick={()=> this.addToCart(p.id)} >Add to Cart</button>
                                                    </div> 
                                                } 
                                                
                                                
                                                                                                  
                                            </>
                                            :
                                            <div className="add-to-cart ">
                                                <Link to={'/user/login/'} className="btn btn-success p-3" >Add to Cart</Link>
                                            </div>                    

                                        }

                                        { 
                                            access_token?
                                                <>
                                                    
                                                    {this.state.inWishlist&&
                                                    <div className="add-to-wishlist">
                                                        <NavLink to={'/user/dashbord/wishlist/'} className="btn btn-primary p-3">&#x2714; &nbsp; View Wishlist</NavLink>
                                                    </div>}

                                                    { this.state.loaderAddWishlist&&
                                                    <div className="add-to-wishlist-loader btn btn-primary">
                                                        <div className=" loader-in-button "></div>
                                                    </div>}   

                                                    { !this.state.inWishlist&&!this.state.loaderAddWishlist&&
                                                    <div className="add-to-wishlist">
                                                        <button className="btn btn-primary p-3" onClick={()=> this.addToWishlist(p.id)} >Add to Wishlist</button>
                                                    </div>}                                
                                                    
                                                </>:
                                                    <div className="add-to-wishlist">
                                                        <Link to={'/user/login/'} className="btn btn-primary p-3" >Add to Wishlist</Link>
                                                    </div>                                                                               
                                           
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
                             


                                    <div className="product-description-container mt-5" >
                                        <h5 className="text-center">Product Description</h5>
                                        
                                            <div className="container mt-4">
                                            {
                                                this.state.singleProduct[0]&& 
                                                this.state.singleProduct[0].product_color_variant.product.description
                                            }
                                                
                                            </div>

                                    
                                    </div>


                                </div>
                            </React.Fragment>
                           ))
                           
                        }
            
              </div>
              <hr/>
              

            </>
        );
    };
};

function UserDetailWrapper({cart_counter}) {
    const { category,slug,color,size } = useParams();
    return <Product_Details cartCount={cart_counter} category={category} slug={slug} color={color} size={size} />;
};
  
export default UserDetailWrapper;

