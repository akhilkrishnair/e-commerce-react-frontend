import { PureComponent } from "react";
import { Swiper,SwiperSlide } from "swiper/react";
import { Navigation,  Mousewheel } from 'swiper/modules';

class CurrentProductImagesSlider extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const {singleProduct,changeImage} = this.props
        return (
            <>
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
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
                        <img className="img-src" onMouseOver={(event) => changeImage(event)}
                            src={
                                singleProduct.product_color_variant.image7
                            }
                            alt={singleProduct.product_color_variant.product.slug}
                        />
                        </SwiperSlide>:null
                    }
                </Swiper>
            </>
        );
    }
}

export default CurrentProductImagesSlider;