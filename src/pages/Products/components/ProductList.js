import { PureComponent } from "react";
import './productList.css';
import { Link } from "react-router-dom";
import { getProductDetailsUrl, getProductImageUrl, renderProductName,renderProductPrice } from "utils/productUtills";


class ProductList extends PureComponent {

    render() {
        const {
            productVariants,
            productLoader,
            wishlistCheck,
        } = this.props
        return (
            <>
            {productVariants&&!productLoader&&
                productVariants.map((product) => (
                    <Link
                        className={`product-details-link card mx-2 mb-5 ${window.innerWidth > 500?"mt-3":"mt1"}` }
                        key={product.id}
                        to={getProductDetailsUrl(product)}>

                        <div className="each-product-container" >                   
                            <div className="product-image-wishlist-button-container">
                                <div className='product-add-wishlist-icon'>
                                    <div className='wishlist-button-container'>
                                        <div hidden={true} className='wishlist-action-loader'></div>                             
                                        {wishlistCheck(product)}
                                    </div>
                                </div>
                                <div className="image-container">
                                    <img src={getProductImageUrl(product)}
                                        className=""
                                        alt="..."/>                 
                                </div>
                            </div>
            
                            <div className={window.innerWidth > 500?"card-body":"small-screen-title"}>
                                {renderProductPrice(product)}
                                <p className="card-title">{renderProductName({product:product})}</p>
                            </div>

                        </div>


                    </Link>
                ))
            }
            </>
        );
    }
}

export default ProductList;