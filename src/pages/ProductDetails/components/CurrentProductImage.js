import { PureComponent } from "react";

class CurrentProductImage extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const {singleProduct} = this.props
        return (
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
        );
    }
}

export default CurrentProductImage;