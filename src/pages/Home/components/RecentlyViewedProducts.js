import { PureComponent } from "react";
import { Link } from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation } from "swiper/modules";
import { renderProductName } from "utils/productUtills";


class RecentlyViewedProducts extends PureComponent {
    
    render() {

        const { 
            recentProducts
        } = this.props

        return (
            <>
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
                    width={ window.innerWidth > 600 ? 100*11: 100*8}
                    >

                        {
                            recentProducts&&recentProducts.map((rp) => (                                   
                                <SwiperSlide key={rp.product.id}  className="each-recent-product">
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
                                                {renderProductName(rp)}
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
            </>
        );
    }
}

export default RecentlyViewedProducts;