import './ProductDetails.css';
import React ,{ PureComponent } from "react";
import { useParams } from "react-router-dom";
import { accessToken } from 'intersepter/axios';
import 'swiper/css';
import 'swiper/css/navigation';
import SelectSize from './components/SelectSize';
import SelectColor from './components/SelectColor';
import AddToCartButton from './components/AddToCartButton';
import AddToWishlist from './components/AddToWishlist';
import CurrentProductImagesSlider from './components/CurrentProductImagesSlider';
import CurrentProductImage from './components/CurrentProductImage';
import ProductDiscription from './components/ProductDiscription';
import ProductReviewSubmitForm from './components/ProductReviewSubmitForm';
import ProductReviewsPaginator from './components/ProductReviewsPaginator';
import ProductReviews from './components/ProductReviews';
import { axiosWithoutAuthentication, axiosWithAuthentication } from 'intersepter/axios';
import { CartContext } from 'contexts/contexts';
import { checkProductInWishlist, productAddToWishlist } from 'api/wishlist';
import { checkProductInCart, productAddToCart } from 'api/cart';
import { renderProductVariant } from 'utils/productUtills';


class ProductDetails extends PureComponent {

    static contextType = CartContext;
    
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
            this.filterProductVariant(this.state.allProducts);
        };
        if (this.state.singleProduct !== prevState.singleProduct && accessToken){
            this.handleFetchCart();
            this.handleFetchWishlist();
        };
        if (this.state.singleProduct && prevState.singleProduct !== this.state.singleProduct){
            this.fetchProductDescription();
            this.fetchProductReviews();
        };

    }; 

    renderProductTitleAndPrice = (singleProduct) => {
        const productName = singleProduct.product_color_variant.product.name
        const color = singleProduct.product_color_variant.color.name
        const size = singleProduct.size.name

        const variantTitle = renderProductVariant(singleProduct) 
              
        // if (color !== 'no-color' && color !== null){
        //     variantTitle += `(${color}`
        // }
        // if (size !== 'no-size' && size !== null){
        //     if (variantTitle){
        //         variantTitle += `, ${size})`
        //     }else{
        //         variantTitle += `(${size})`
        //     }
        // }else{
        //     variantTitle += ')'
        // }

        const title = `${productName} ${variantTitle}`

        
        return (
            <>
                <h5 className='product-title'>
                    { title }
                </h5>
                <br/>
                <h6 className='product-price' >Rs.
                    {singleProduct.price-singleProduct.price/100*singleProduct.offer}
                    <span className="ms-4 text-secondary text-decoration-line-through" >Rs.{singleProduct.price}</span>
                    <span className="ms-4 text-success">{singleProduct.offer}% off</span>
                </h6>
                <br/><br/><br/>
            </>
        )
    }

    addToRecentProducts = (product_id) => {
        if(!this.state.singleProduct) return
        
        if(accessToken){
            const data = {
                product:product_id
            }
            axiosWithAuthentication
            .post('product/recent-products/',
            data
            ).then((response) => {
            }).catch((error) => {})

        }else{
            let recentProductLocal = []           
            if (window.localStorage.getItem("recentProducts")){
                recentProductLocal = JSON.parse(window.localStorage.getItem("recentProducts")) 
            } 
            if(!recentProductLocal.find(rp => rp.product.id === this.state.singleProduct.id)){
                if(this.state.singleProduct){
                    recentProductLocal.push({product:this.state.singleProduct})
                    window.localStorage.setItem("recentProducts",JSON.stringify(recentProductLocal))
                }
            }
        }
    }

    filterProductVariant = (res_data_from_fetch) => {
        let product_variant = res_data_from_fetch

        const {slug,color,size} = this.props;
        const singleProduct = product_variant.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color && 
                    p.size.name === size
        });

        if(singleProduct.length < 1) return

        this.setState({singleProduct:singleProduct[0]});
        
        this.addToRecentProducts(singleProduct[0].id)
        
        const colorVariant = product_variant.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.size.name === size                   
        }).sort();
        this.setState({colorVariant:colorVariant});

        const sizeVariant = product_variant.filter((p) => {
            return p.product_color_variant.product.slug === slug && 
                    p.product_color_variant.color.name === color                  
        }).sort((a,b) => a.size.name[0]-b.size.name[0]) ;
        this.setState({sizeVariant:sizeVariant});
    };
    
    fetchProduct = () => {
        axiosWithoutAuthentication
        .get(`product-variants/?product_id=${this.props.id}`)
        .then((response) => {
            this.setState({allProducts:response.data});
            this.filterProductVariant(response.data);
        })
        .catch((error) => {
        });
    };

    fetchProductDescription = () => {
        const product_id = this.props.id
        axiosWithoutAuthentication
        .get(`product/description/?product_id=${product_id}`)
        .then((res) => {
            if(res.data.length >0){
                this.setState({productDescription:res.data})
            }
        }).catch((err) => {
        })
    }

    changeImage(e){
        let current_img = document.getElementsByClassName("current-image")[0].children[0]       
        current_img.src = e.target.src  
    };
      
    addToCart = (product_variant_id) => {
        this.setState({loaderAddCart:true})
        productAddToCart(product_variant_id)
        .then((res) => {
            this.handleFetchCart();
            this.context.handleFetchCartCount();
        })
        .catch((error)=>{
        })
        .finally(() => {
            setTimeout(() => {                  
                this.setState({loaderAddCart:false})
            }, 2000);
        })
    };

    addToWishlist = (product_variant_id) => {
        this.setState({loaderAddWishlist:true})
        productAddToWishlist(product_variant_id)
        .then((res)=>{
            this.handleFetchWishlist()
        }).catch((err) => {
            this.setState({loaderAddWishlist:false})
        })
    };

    handleFetchCart = async () => {

        this.setState({loaderAddCart:true})

        const {singleProduct} = this.state

        if (singleProduct){
            checkProductInCart(singleProduct.id)
            .then((res)=>{
                this.setState({inCart:res.data.incart});          
            }).catch((error)=> {
            }).finally(() => {
                this.setState({loaderAddCart:false})
            });
        }
    };

    handleFetchWishlist = async () => {

        this.setState({loaderAddWishlist:true})
        
        const {singleProduct} = this.state
        
        if (singleProduct){
            checkProductInWishlist(singleProduct.id)
            .then((res)=>{
                this.setState({inWishlist:res.data.in_wishlist});           
            }).catch((error)=>{
            }).finally(()=>{
                this.setState({loaderAddWishlist:false})
            })
        }
    };

    fetchProductReviews = () => {
        const product_id = this.state.singleProduct.product_color_variant.product.id
        axiosWithAuthentication
        .get(`product/reviews/?product_id=${product_id}`)
        .then((res) => {
            if (res.data.length>0){
                this.setState({productReview:res.data})
            }
        }).catch((err) => {
        }).then(()=>{
            this.setState({productReviewLoading:false})
        })
    }

    handleReviewText = (e) => {
        const {name, value} = e.target
        this.setState({[name]:value})
    }

    reviewSubmitHandle = async (e) => {

        e.preventDefault();
        
        this.setState({productReviewLoading:true})
        const review = this.state.productReviewText
        const product_id = this.state.singleProduct.product_color_variant.product.id

        const data = {
            reveiw:review,
            product_id:product_id
        }

        await   axiosWithAuthentication
                .post("product/reveiw-submit/",
                data)
                .then((response) => {
                    this.fetchProductReviews();
                    this.setState({productReviewSubmitted:true})
                }).catch((error)=>{
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

                            <div  className="product-image-container">

                                {<CurrentProductImage singleProduct={singleProduct} />}

                                {<CurrentProductImagesSlider 
                                    singleProduct={singleProduct} changeImage={this.changeImage} />}

                                {/* add to cart add to wishlist button section starts */}
                                <div className="add-to-cart-add-to-wishlist-container">

                                    {<AddToCartButton 
                                        loaderAddCart={this.state.loaderAddCart} 
                                        inCart={this.state.inCart}
                                        singleProductId={singleProduct&&singleProduct.id}
                                        singleProduct={singleProduct}
                                        addToCart={this.addToCart} />}

                                    {<AddToWishlist
                                        inWishlist={this.state.inWishlist}
                                        loaderAddWishlist={this.state.loaderAddWishlist}
                                        addToWishlist={this.addToWishlist}
                                        singleProductId={singleProduct&&singleProduct.id} />}
                                        
                                </div>

                            </div>

                            <div className="product-details-container">
                                {this.renderProductTitleAndPrice(singleProduct)}

                                {/* variant selection section starts */}
                                <div className="product-variant-selection">
                                    {/* select color */}
                                    {singleProduct.product_color_variant.color.name !=="no-color"
                                    &&< SelectColor 
                                    colorVariant={this.state.colorVariant}/>}
                                    {/* select size */}
                                    {singleProduct.size.name !== "no-size"&&
                                    <SelectSize sizeVariant={this.state.sizeVariant}/>}
                                </div>
                            
                                {<ProductDiscription 
                                productDescription={this.state.productDescription}
                                productDescriptionLoading={this.state.productDescriptionLoading} />}
                              
                            </div>
                        </React.Fragment>                        
                    }
            
               </div>
               
              <br/><br/>
              <hr/>
              <h4 id='review-and-rating' className='text-center'>Reviews and Rating</h4><hr/>

                {    
                    
                    !this.state.productReviewLoading?                
                    <div className='review-and-rating-container'>

                        <div className='users-review-container'>

                            <ProductReviews reviewFiltered={reviewFiltered} />

                            {!this.state.productReview&&!this.state.productReviewLoading&&<h4>No reviews for this product</h4>}

                            <div className='rating-star-container'></div>

                            <ProductReviewsPaginator 
                            currentPage={currentPage}
                            all_pages={all_pages}
                            pages={pages}
                            reviewPaginator={this.state.reviewPaginator}
                            changeReviewPage={this.changeReviewPage} />
                        </div>

                        <ProductReviewSubmitForm 
                        reviewSubmitHandle={this.reviewSubmitHandle}
                        handleReviewText={this.handleReviewText}
                        productReviewLoading={this.state.productReviewLoading}
                        productReviewSubmitted={this.state.productReviewSubmitted} 
                        productReviewError={this.state.productReviewError} />

                    </div>: <p>loading...</p>
                }           
            </>
        );
    };
};

function UserDetailWrapper() {

    const { category,slug,color,size,id } = useParams();
    return <ProductDetails 
        category={category} 
        slug={slug} 
        color={color} 
        size={size}
        id={id} 
    />

};
  
export default UserDetailWrapper;

