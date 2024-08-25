import { PureComponent } from "react";
import './Home.css';
import home_img_2 from 'assets/images/home/evo_laptops.jpg'
import home_img_3 from 'assets/images/home/sony_camera_ads 1 .jpg'
import {  FaCommentDots, FaCreditCard, FaShippingFast, FaUndo } from "react-icons/fa";
import  { axiosWithoutAuthentication,axiosWithAuthentication, accessToken } from "intersepter/axios";
import TodayBestDeal from "./components/TodayBestDeal";
import RecentlyViewedProducts from "./components/RecentlyViewedProducts";
import OurCollection from "./components/OurCollection";



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
        axiosWithoutAuthentication
        .get('categories/')
        .then((response) => {
            this.setState({categories:response.data})
        })
        .catch((error) => {
        })
    }

    fetchBestDealProducts = () => {
        axiosWithoutAuthentication
        .get(`product-variants/?best_deal=${15}`)
        .then((response) => {
            this.setState({bestDealProducts:response.data.results})
        })
        .catch((error) => {})      
    }

    
    fetchRecentProducts = () => {
        if(!accessToken){
            this.setState({recentProducts:JSON.parse(window.localStorage.getItem("recentProducts"))})
            return 
        }
        axiosWithAuthentication
        .get('product/recent-products/')
        .then((response) => {
            window.localStorage.removeItem("recentProducts")
            if (response.data.length > 0){
                this.setState({recentProducts:response.data})
            }
        })
        .catch((error) => {
        });
    };


    imageChangeHandle = (e,new_img) => {
        e.target.src = new_img
    }
    mouseLeaveHandle = (e,prev_image) => {
        e.target.src = prev_image
    }

    renderProductName = (rp) => {
        if(!rp) return

        let productName = rp.product.product_color_variant.product.name
        let productVariantName = `(${rp.product.product_color_variant.color.name !=="no-color"?rp.product.product_color_variant.color.name +" ,":""}${rp.product.size.name})`
        if(productName.length > 25){
            return `${productName.slice(0,25)} ${productVariantName}`
        }
        return `${productName} ${productVariantName}`
    }


    render() {

        const {
            categories,
            bestDealProducts,
            recentProducts
        } = this.state

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
                <OurCollection categories={categories} />
                {/* category or collection section ends */}

                {/* today best deal section starts */}
                <TodayBestDeal
                    bestDealProducts = {bestDealProducts}
                    imageChangeHandle = {this.imageChangeHandle} 
                    mouseLeaveHandle = {this.mouseLeaveHandle} />
                {/* today best deal section ends */}

                {/* recent products section starts */}
                <RecentlyViewedProducts 
                    recentProducts = {recentProducts} /> 
                {/* recent products section ends */}
            </>
        );
    }
}

export default Home;