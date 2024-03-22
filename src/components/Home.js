import { PureComponent } from "react";
import './css/Home.css';
import home_img_2 from '../images/home/evo_laptops.jpg'
import home_img_3 from '../images/home/sony_camera_ads 1 .jpg'
import axios from "axios";
import {baseUrl} from '../App';
import { Link } from "react-router-dom";
import { CollectionLoader } from "./loader_components/CollectionLoader";
import {  FaCommentDots, FaCreditCard, FaShippingFast, FaUndo } from "react-icons/fa";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation } from "swiper/modules";




class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            categories:null,
            bestDealProducts:null,
            recentProducts:null,
        };
    }

    componentDidMount(){
        window.scrollTo(0,0)
        this.fetchCategory();
        this.fetchBestDealProducts();
        this.fetchRecentProducts();
    }
    
    fetchCategory = () => {
        axios.get(baseUrl+'categories/')
        .then((response) => {
            this.setState({categories:response.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    fetchBestDealProducts = () => {

        axios
        .get(`${baseUrl}product-variants/?best_deal=${15}`)
        .then((response) => {
            this.setState({bestDealProducts:response.data.results})
        }).catch((error) => {
            console.log(error)
        })
        
    }

    
    fetchRecentProducts = () => {
        axios
        .get(baseUrl+'product/recent-products/')
        .then((response) => {
            console.log(response)
            window.localStorage.removeItem("recentProducts")
            if (response.data.length > 0){
                this.setState({recentProducts:response.data})
            }
        }).catch((error) => {
            console.log(error)
            console.log(JSON.parse(window.localStorage.getItem("recentProducts")))
            this.setState({recentProducts:JSON.parse(window.localStorage.getItem("recentProducts"))})
        });
    };


    imageChangeHandle = (e,new_img) => {
        e.target.src = new_img
    }
    mouseLeaveHandle = (e,prev_image) => {
        e.target.src = prev_image
    }

    render() {

        const {
            categories,
            bestDealProducts,
            recentProducts
        } = this.state
        console.log("recent ",recentProducts)
        return (
            <>
                <div className="home-corousile-container">
                    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                            <img src={home_img_2} className="d-block w-100" alt="..."/>
                            </div>
                            <div className="carousel-item">
                            <img src={home_img_3} className="d-block w-100" alt="..."/>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

{/* Home carousel section ends */}

{/* service delivery payment details section starts */}
                <div className="about-services-delivery-payment">
                    <div className="each-services">
                        <div className="service-icon">
                            <FaShippingFast/>
                        </div>
                        <div className="service-details">
                            <h6>Free Shipping</h6>
                            <p>When you spend Rs.500 or more</p>
                        </div>
                    </div>
                    <div className="each-services">
                        <div className="service-icon">
                            <FaCommentDots/>
                        </div>
                        <div className="service-details">
                            <h6>We are available 24/7</h6>
                            <p>Need help? contact us anytime</p>
                        </div>
                    </div>
                    <div className="each-services">
                        <div className="service-icon">
                            <FaUndo/>
                        </div>
                        <div className="service-details">
                            <h6>Satisfied or Return</h6>
                            <p>Easy 30-day return policy</p>
                        </div>
                    </div>
                    <div className="each-services">
                        <div className="service-icon">
                            <FaCreditCard/>
                        </div>
                        <div className="service-details">
                            <h6>100% secure payments</h6>
                            <p>Visa, Mastercard</p>
                        </div>
                    </div>
                </div>

{/* service delivery payment details section ends */}

{/* category or collection section starts */}
                <div className="our-collection-container">
                    <h3 className="text-center w-100 mb-4">Our Collections</h3>

                    {
                        !categories?
                            <>
                                <CollectionLoader/>
                                <CollectionLoader/>
                                <CollectionLoader/>
                                <CollectionLoader/>
                            </>:
                        categories.map((c) => (
                            <Link 
                                key={c.id}
                                className="each-collection-container"
                                to={`/${c.slug}/`}>
                                <div className="collection-img-container">
                                    <img src={c.image} alt={c.slug}/>
                                </div>
                                <h6 className="text-center">{c.name}</h6>

                            </Link>
                        ))
                    }
                </div>
{/* category or collection section ends */}

{/* today best deal section starts */}
                <div className="today-best-deal-container">
                    <h3 className="mb-4 ms-3">Todays's best deal</h3>

                    <div className="best-deal-product-variants-container">
                        {
                            bestDealProducts&&bestDealProducts.map((bdp) => (
                                <Link
                                target="_blank"
                                    to={
                                        `/${bdp.product_color_variant.product.category.slug}/${bdp.product_color_variant.product.slug}/${bdp.product_color_variant.color.name}/${bdp.size.name}/${bdp.product_color_variant.product.id}/`
                                    } 
                                    className="best-deal-each-product-variant">
                                    <div className="best-deal-product-image-container">
                                        
                                            <img
                                            onMouseOver={ 
                                                (e) => this.imageChangeHandle(
                                                    e,
                                                    bdp.product_color_variant.image3?
                                                    bdp.product_color_variant.image3:bdp.product_color_variant.product.image_main
                                                    )
                                                } 
                                            onMouseLeave={
                                                (e) => this.mouseLeaveHandle(
                                                    e,
                                                    bdp.product_color_variant.image1?
                                                    bdp.product_color_variant.image1:
                                                    bdp.product_color_variant.product.image_main
                                                )
                                            }
                                            src={
                                                bdp.product_color_variant.image1?
                                                bdp.product_color_variant.image1:
                                                bdp.product_color_variant.product.image_main
                                            }
                                            alt={bdp.product_color_variant.product.slug}/>
                                        
                                    </div>
                                    <div className="best-deal-product-variant-details">
                                        <h6 className="title">{`${bdp.product_color_variant.product.name} (${bdp.product_color_variant.color.name}, ${bdp.size.name})`} </h6>
                                        <div className="price-and-offer">
                                            <span className="selling-price">Rs.{bdp.price-bdp.price/100*bdp.offer}</span>
                                            <span className="orginal-price">Rs.{bdp.price }</span>
                                            <span className="offer">off {bdp.offer}%</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }

                    </div>
                </div>
{/* today best deal section ends */}


{/* recent products section starts */}
                {
                    recentProducts&&
                    
                    <>
                        <h3 className="bg-white mt-5 p-3">Recently viewed Products</h3>                   
                        <Swiper
                        className="recent-product-swiper"
                        cssMode={true}
                        loop={false}
                        slidesPerView={4}
                        navigation={true}
                        modules={[Navigation]} 
                        width={100*11}
                        >

                            {
                                recentProducts.map((rp) => (
                                    
                                        <SwiperSlide  className="each-recent-product">
                                            <Link
                                             to={`/${rp.product.product_color_variant.product.category.slug}/${rp.product.product_color_variant.product.slug}/${rp.product.product_color_variant.color.name}/${rp.product.size.name}/${rp.product.product_color_variant.product.id}/`} >
                                                <div className="recent-product-image-container" >
                                                    <img src={
                                                        rp.product.product_color_variant.image1?
                                                        rp.product.product_color_variant.image1:
                                                        rp.product.product_color_variant.product.image_main
                                                    }
                                                    alt={rp.product.product_color_variant.product.slug}
                                                    />
                                                </div>
                                                <div className="recent-product-details">
                                                    <div className="recent-product-title">
                                                        {
                                                        `${rp.product.product_color_variant.product.name} 
                                                        (${rp.product.product_color_variant.color.name}, ${rp.product.size.name})`
                                                        }
                                                    </div>
                                                    <div className="recent-product-price-detail">
                                                        <span className="selling-price">
                                                            Rs.{rp.product.price-(rp.product.price/100*rp.product.offer)}
                                                        </span>
                                                        <span className="original-price">
                                                            Rs.{
                                                                rp.product.price
                                                            }
                                                        </span>
                                                        <span className="offer">
                                                            {rp.product.offer}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    
                                ))
                            }
                        </Swiper>
                    </>
                }
{/* recent products section ends */}



            </>
        );
    }
}

export default Home;