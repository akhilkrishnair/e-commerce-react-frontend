import './css/product_details.css';
import axios from "axios";
import React ,{ PureComponent } from "react";
import { Link, NavLink, json, useParams } from "react-router-dom";
import {Swiper,SwiperSlide} from 'swiper/react';
import { Navigation,  Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { access_token,baseUrl } from '../App';
import {FaArrowLeft,FaArrowRight, FaCheckCircle} from 'react-icons/fa';

class Product_Details extends PureComponent {
    
    constructor(props){
        super(props)
        this.state = {
            allProducts:[],
            singleProduct:null,
            colorVariant:[],
            sizeVariant:[],
            productReviewText:"",
            productReviewError:"",
            productDescriptionLoading:false,
            productDescription:null,
            productReviewLoading:false,
            productReview:null,
            productReviewSubmitted:false,
            inCart:false,
            inWishlist:false,
            currentUser:false,
            cartCount:null,
            loaderAddCart:false,
            loaderAddWishlist:false,
            reviewPaginator:{
                currentPage:1,
                itemPerPage:5
            }
        };
    };

    componentDidMount(){
        window.scrollTo(0,0)
        this.setState({productReviewLoading:true})
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
        if (this.state.singleProduct && prevState.singleProduct !== this.state.singleProduct){
            this.fetchProductDescription();
            this.fetchProductReviews();
        };

    }; 



    addToRecentProducts = (product_id) => {

        const data = {
            product:product_id
        }
        axios
        .post(baseUrl+'product/recent-products/',
        data)
        .then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)

            let recent_products_local = []           
            if (window.localStorage.getItem("recentProducts")){
                recent_products_local = JSON.parse(window.localStorage.getItem("recentProducts"))     
                console.log("recent product ",recent_products_local)
            }
            if(!recent_products_local.find(rp => rp.id === this.state.singleProduct.id)){
                recent_products_local.push({product:this.state.singleProduct})
                window.localStorage.setItem("recentProducts",JSON.stringify(recent_products_local))
            }
            
        })
    }


    filterProductVariant = () => {

        const {slug,color,size} = this.props;
        const singleProduct = this.state.allProducts.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color && 
                    p.size.name === size
        });
        this.setState({singleProduct:singleProduct[0]});
        
        this.addToRecentProducts(singleProduct[0].id)
        
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

    
    fetchProduct = () => {
        axios
        .get(`${baseUrl}product-variants/?product_id=${this.props.id}`)
        .then((response) => {
            this.setState({allProducts:response.data});
            this.filterProductVariant();
        })
        .catch((error) => {
            console.log("error ",error)
        });
    };

    fetchProductDescription = () => {
        const product_id = this.props.id
        axios
        .get(`${baseUrl}product/description/?product_id=${product_id}`)
        .then((res) => {
            if(res.data.length >0){
                this.setState({productDescription:res.data})
            }
        }).catch((err) => {
            console.log(err)
        })
    }

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
        if (singleProduct){
            await axios.post(baseUrl+'cart/in-cart/',
                {product_variant:singleProduct.id}           
            )
            .then((res)=>{
                this.setState({inCart:res.data.incart});          
            }).catch((error)=>{
                console.log(error)
            }).then(() => {
                this.setState({loaderAddCart:false})
            });
        }
    };


    fetchWishlist = async () => {
        const {singleProduct} = this.state
        
        if (singleProduct){
            await axios.post(baseUrl+'wishlist/in-wishlist/',
                { product_variant:singleProduct.id}
            )
            .then((res)=>{
                this.setState({inWishlist:res.data.in_wishlist});           
            }).catch((error)=>{
                console.log(error)
            }).then(()=>{
                this.setState({loaderAddWishlist:false})
            })
        }
    };


    fetchProductReviews = () => {
        const product_id = this.state.singleProduct.product_color_variant.product.id
        axios
        .get(`${baseUrl}product/reviews/?product_id=${product_id}`)
        .then((res) => {
            if (res.data.length>0){
                this.setState({productReview:res.data})
            }
        }).catch((err) => {
            console.log(err)
        }).then(()=>{
            this.setState({productReviewLoading:false})
        })
    }


    handleReviewText = (e) => {
        const {name, value} = e.target
        this.setState({[name]:value})
    }

    reviewSubmitHandle = async (e) => {
        this.setState({productReviewLoading:true})
        e.preventDefault();
        const review = this.state.productReviewText
        const product_id = this.state.singleProduct.product_color_variant.product.id

        const data = {
            reveiw:review,
            product_id:product_id
        }

        await   axios
                .post(baseUrl+"product/reveiw-submit/",
                data)
                .then((response) => {
                    this.fetchProductReviews();
                    this.setState({productReviewSubmitted:true})
                }).catch((error)=>{
                    console.log('err', error)
                    if (error.response.status === 401){
                        this.setState({productReviewError:"Login required"})
                    }
                }).then(()=>{
                    this.setState({productReviewLoading:false})
                });

        e.target.reset();
    }

    changeReviewPage = (page) => {
        let current_page = this.state.reviewPaginator
        current_page.currentPage = page
        this.setState({...this.state.reviewPaginator,reviewPaginator:current_page})
        
        const review_element = document.getElementById('review-and-rating')
        review_element.scrollIntoView({behavior:"smooth", block:"start"})
         
    }


    
    render() {   
        
        const {itemPerPage,currentPage} = this.state.reviewPaginator
        const {singleProduct} = this.state


        let pages = 0
        if (this.state.productReview){
            pages = Math.round(this.state.productReview.length/itemPerPage)
            let decimal_pages = this.state.productReview.length/itemPerPage
            if(pages<decimal_pages){
                pages+=1
            }

        }
        
        let all_pages = []
        for(let i=1; i<=pages; i++){
             all_pages.push(i)
        }

        const current_page_last_index = itemPerPage*currentPage
        const current_page_first_index = current_page_last_index-itemPerPage

        const reviewFiltered = this.state.productReview&&this.state.productReview.slice(current_page_first_index,current_page_last_index)

        return (
            <>               
                <div className="product-main-container">   
                    
                    {
                        !singleProduct&&
                        <div className=" loader-element" >
                            <div className='loader'></div>
                        </div>
                    }

                    {   
                        
                        singleProduct&&
                        <React.Fragment key={singleProduct.id}>
                            {/* {this.addToRecentProducts(singleProduct.id)} */}
                            <div  className="product-image-container">
                                <div className="current-image">
                                    <img 
                                        src={
                                        singleProduct.product_color_variant.image1?
                                        singleProduct.product_color_variant.image1:
                                        singleProduct.product_color_variant.product.image_main
                                        }
                                        alt={singleProduct.product_color_variant.product.slug}
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
                                        singleProduct.product_color_variant.image1?
                                        <SwiperSlide  className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image1
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image2?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image2
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image3?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image3
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image4?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image4
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image5?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image5
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image6?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image6
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
                                        />
                                        </SwiperSlide>:null
                                    }
                                    {
                                        singleProduct.product_color_variant.image7?
                                        <SwiperSlide className="img">
                                        <img className="img-src" onMouseOver={(event) => this.changeImage(event)}
                                            src={
                                                singleProduct.product_color_variant.image7
                                            }
                                            alt={singleProduct.product_color_variant.product.slug}
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
                                                    <NavLink to={'/user/cart/'} className="btn btn-success p-3" ><FaCheckCircle/> &nbsp; View Cart</NavLink>
                                                </div> :
                                                <div className="add-to-cart ">
                                                    <button className="btn btn-success p-3" onClick={()=> this.addToCart(singleProduct.id)} >Add to Cart</button>
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
                                                    <NavLink to={'/user/dashbord/wishlist/'} className="btn btn-primary p-3"><FaCheckCircle/> &nbsp; View Wishlist</NavLink>
                                                </div>}

                                                { this.state.loaderAddWishlist&&
                                                <div className="add-to-wishlist-loader btn btn-primary">
                                                    <div className=" loader-in-button "></div>
                                                </div>}   

                                                { !this.state.inWishlist&&!this.state.loaderAddWishlist&&
                                                <div className="add-to-wishlist">
                                                    <button className="btn btn-primary p-3" onClick={()=> this.addToWishlist(singleProduct.id)} >Add to Wishlist</button>
                                                </div>}                                
                                                
                                            </>:
                                                <div className="add-to-wishlist">
                                                    <Link to={'/user/login/'} className="btn btn-primary p-3" >Add to Wishlist</Link>
                                                </div>                                                                               
                                        
                                    }
                                        

                                </div>

                            </div>
                            <div className="product-details-container">
                                <h5 className='product-title'>
                                    {   
                                        singleProduct.product_color_variant.color.name !== 'no-color'?
                                        singleProduct.product_color_variant.product.name +" ("+                        
                                        singleProduct.product_color_variant.color.name+", "+
                                        singleProduct.size.name+")":
                                        
                                        singleProduct.product_color_variant.product.name +" ("+                                     
                                        singleProduct.size.name+")"
                    
                                    }
                                </h5>
                                <br/>
                                <h6 className='product-price' >Rs.
                                    {
                                        singleProduct.price-
                                        singleProduct.price/100*singleProduct.offer
                                    }
                                    <span className="ms-4 text-secondary text-decoration-line-through" >Rs.{singleProduct.price}</span>
                                    <span className="ms-4 text-success">{singleProduct.offer}% off</span>
                                </h6>
                                <br/><br/><br/>


                            {/* variant selection section starts */}
                                <div className="product-variant-selection">

                                    { 
                                        singleProduct.product_color_variant.color.name !=="no-color"&&
                                        <div key={'color'} className="color-selection" >
                                            <h6 className="me-4">Colors available : </h6>
                                            {
                                                this.state.colorVariant && this.state.colorVariant.map((cv) => (
                                                    <NavLink 
                                                        key={cv.id} 
                                                        className="color-variant" 
                                                        to={
                                                            `/${cv.product_color_variant.product.category.slug}/${cv.product_color_variant.product.slug}/${cv.product_color_variant.color.name}/${cv.size.name}/${cv.product_color_variant.product.id}/`
                                                        }
                                                    >
                                                        <img 
                                                            src={
                                                                cv.product_color_variant.image1?
                                                                cv.product_color_variant.image1:
                                                                cv.product_color_variant.product.image_main
                                                            }
                                                            alt={singleProduct.product_color_variant.product.slug} 
                                                        />
                                                    </NavLink>
                                                ))
                                            };

                                        </div>
                                    }


                                    <div key={'size'} className="size-selection">
                                        <h6 className="me-4">Size available : </h6>
                                        {
                                            this.state.sizeVariant && this.state.sizeVariant.map((sv) => (
                                                <NavLink 
                                                    key={sv.id}
                                                    className="size-variant" 
                                                    to={
                                                        `/${sv.product_color_variant.product.category.slug}/${sv.product_color_variant.product.slug}/${sv.product_color_variant.color.name}/${sv.size.name}/${sv.product_color_variant.product.id}/`
                                                    }
                                                >
                                                    {sv.size.name}
                                                </NavLink>
                                            ))
                                        }

                                    </div>

                                </div>
                            

                                {
                                    this.state.productDescription&&!this.state.productDescriptionLoading&&
                                    <div className="product-description-container mt-5" >
                                        <h3 className="section-title">Product Description</h3>
                                        
                                        {
                                            this.state.productDescription.map((pd, index) => (
                                                <div key={pd.id} className={`each-description ${index % 2 === 0?"right":"left"}`}>
                                                    {
                                                        pd.image?
                                                        <div className='description-img'>
                                                            <img src={pd.image} alt={pd.discription_title} />
                                                        </div>:null
                                                    }
                                                    <div className='description-details'>
                                                        <h6>{pd.discription_title}</h6>
                                                        <p>{pd.description}</p>
                                                    </div>
                                                </div>
                                            ))  
                                        }

                                    </div>
                                }
                              
                            </div>
                        </React.Fragment>
                        // ))                          
                    }
            
               </div>
               
              <br/><br/>
              <hr/>
              <h4 id='review-and-rating' className='text-center'>Reviews and Rating</h4><hr/>

                {    
                    
                    !this.state.productReviewLoading?                
                    <div className='review-and-rating-container'>

                        <div className='users-review-container'>
                                {
                                    reviewFiltered&&reviewFiltered.map((pr) => (
                                    <div key={pr.id} className='each-review-container'>
                                        <div className='user-details'>
                                            <div className='user-img'>
                                                <img src={pr.user_info.user_image[1] !=='h'?'http://127.0.0.1:8000'+pr.user_info.user_image:pr.user_info.user_image} />
                                            </div>
                                            <h6 className='username'>{pr.user_info.user_name}</h6>
                                         
                                            <span style={{"marginLeft":"auto"}}>{pr.date}</span>
                                           
                                        </div>
                                        <p className='user-review'>
                                            {pr.review}
                                        </p>
                                    </div>
                                    ))
                                }
                                {
                                    !this.state.productReview&&!this.state.productReviewLoading&&
                                    <h4>No reviews for this product</h4>
                                }
                                <div className='rating-star-container'>

                                </div>

                                <div className='review-paginator-container'>
                                    
                                    {
                                        pages !== 0&&
                                        <button
                                        onClick={() => this.changeReviewPage(
                                            currentPage>1?currentPage-1:currentPage)} 
                                        className='btn btn-sm btn-outline-dark me-3'>
                                            <FaArrowLeft/>
                                        </button>
                                    }
                                   
                                    {
                                        all_pages.map((page) => (
                                            <button 
                                            key={page}
                                            onClick={() => this.changeReviewPage(page)}
                                            className={`me-1 btn btn-sm ${this.state.reviewPaginator.currentPage===page?"btn-dark": "btn-outline-dark"} `}>
                                            {page}</button>
                                        ))
                                    }

                                    {
                                        pages !==0&&
                                        <button 
                                        onClick={() => this.changeReviewPage(
                                            currentPage !==pages?currentPage+1:currentPage
                                        )}
                                        className='btn btn-sm btn-outline-dark ms-2'>
                                            <FaArrowRight/>
                                        </button>
                                    }
                               </div>
                        </div>

                        <div className='review-submit-form-container'>
                            <h5>Give a review for this product</h5>
                            <form onSubmit={this.reviewSubmitHandle}>
                                <div className='reveiw-text mb-2'>
                                    <textarea 
                                    onChange={this.handleReviewText}
                                    name='productReviewText' 
                                    className='form-control border border-secondary'
                                    required 
                                    rows={5}>
                                    </textarea>
                                </div>

                                {
                                    !this.state.productReviewLoading?
                                    <div className='submit-btn-container'>
                                        {
                                            this.state.productReviewSubmitted&&
                                            <div className='review-submit-response'>review submited</div>
                                        }
                                        {
                                            this.state.productReviewError&&
                                            <div className='text-danger review-submit-response'>!{this.state.productReviewError}</div>
                                        }
                                        <button type='submit' className='btn btn-sm btn-success w-25'>Submit</button>
                                    </div>:
                                    <div className=' submit-btn-container'>
                                        <div className='btn btn-success d-flex justify-content-center w-25'>
                                            <div className='review-submit-loader'></div>
                                        </div>
                                    </div>                                   
                                }

                            </form>

                        </div>
                    </div>: <p>loading...</p>
                }
            

            </>
        );
    };
};

function UserDetailWrapper({cart_counter}) {

    const { category,slug,color,size,id } = useParams();
    return <Product_Details 
        cartCount={cart_counter} 
        category={category} 
        slug={slug} 
        color={color} 
        size={size}
        id={id} 
    />;

};
  
export default UserDetailWrapper;

