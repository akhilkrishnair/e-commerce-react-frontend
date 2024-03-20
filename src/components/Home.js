import { PureComponent } from "react";
import './css/Home.css';
import home_img_2 from '../images/home/evo_laptops.jpg'
import home_img_3 from '../images/home/sony_camera_ads 1 .jpg'
import axios from "axios";
import {baseUrl} from '../App';
import { Link } from "react-router-dom";
import { CollectionLoader } from "./loader_components/CollectionLoader";
import {  FaCommentDots, FaCreditCard, FaShippingFast, FaUndo } from "react-icons/fa";




class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            categories:null,
            bestDealProducts:null
        };
    }

    componentDidMount(){
        this.fetchCategory();
        this.fetchBestDealProducts();
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

    imageChangeHandle = (e,new_img) => {
        console.log(e.target,new_img)
        e.target.src = new_img
    }
    mouseLeaveHandle = (e,prev_image) => {
        e.target.src = prev_image
    }

    render() {
        window.scrollTo(0,0)
        const {
            categories,
            bestDealProducts
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
                                    <img src={c.image}/>
                                </div>
                                <h6 className="text-center my-3">{c.name}</h6>

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
                                            }/>
                                        
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

            </>
        );
    }
}

export default Home;