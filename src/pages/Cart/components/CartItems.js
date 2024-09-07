import { PureComponent } from "react";
import { Link } from "react-router-dom";
import QuantityIncreamentButton from "./QuantityIncreamentButton";
import QuantityDecreamentButton from "./QuantiyDecreamentButton";



class CartItems extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDeleting:false
        }
    }

    handleDelete = async (event,cartProductId) => {
        event.target.hidden = true
        event.target.parentElement.parentElement.children[0].hidden = false       
        this.setState({isDeleting:true})
        await this.props.deleteCart(cartProductId);
        setTimeout(() => {
            this.setState({isDeleting:false})
        }, 1000);
    }

    handleIncreamentCart = async (cartId, cartProductId, elementId) => {
        document.getElementById(elementId).classList.add('quantity-action-loader')
        await this.props.increamentCart({cartId, cartProductId})
        setTimeout(() => {          
            document.getElementById(elementId).classList.remove('quantity-action-loader')
        }, 500);
    }

    handleDecreamentCart = async (cartId, cartProductId, elementId) => {
        document.getElementById(elementId).classList.add('quantity-action-loader')
        await this.props.decreamentCart(cartId, cartProductId)
        setTimeout(() => {
            
            document.getElementById(elementId).classList.remove('quantity-action-loader')
        }, 500);
    }

    render() {

        const {cart} = this.props
        return (
           <>
           {
            cart&&cart.map((cp) => (              
                <div key={cp.id} className="card rounded-3 mb-4">
                    <div className="card-body p-4">
                        <div className="cart-product-container">
                            <Link
                            to={        
                                `/${cp.product_variant.product_color_variant.product.category.slug}/${cp.product_variant.product_color_variant.product.slug}/${cp.product_variant.product_color_variant.color.name}/${cp.product_variant.size.name}/${cp.product_variant.product_color_variant.product.id}/`
                                }

                            className="cart-product-img-container">
                                <img
                                    src={
                                        cp.product_variant.product_color_variant.image1?
                                        cp.product_variant.product_color_variant.image1:
                                        cp.product_variant.product_color_variant.product.image_main
                                    }
                                    className="img-fluid rounded-3"
                                    alt={"Cotton T-shirt"}
                                />
                            </Link>
                            <div className="cart-details-container cart-product-variant">
                                <p className=" fw-normal mb-2">
                                    {`${cp.product_variant.product_color_variant.product.name}`}
                                </p>
                                <p>
                                    <span className="text-muted">Size: </span>{cp.product_variant.size.name}<br/>
                                    <span className="text-muted">Color: </span>{cp.product_variant.product_color_variant.color.name}
                                </p>
                            </div>

                            <div className="cart-details-container cart-increament-decreament-btn">
                                {  
                                    <>
                                        <QuantityDecreamentButton 
                                        cartId={cp.id}
                                        quantity={cp.quantity}
                                        decreamentCart={this.handleDecreamentCart} />

                                        <label
                                            id={'quantity-action-loader-'+cp.id}                       
                                            className=" form-control form-control-sm text-center w-50">
                                            <span>{cp.quantity}</span> 
                                        </label>  

                                        <QuantityIncreamentButton 
                                        cartId={cp.id}
                                        productVariantId={cp.product_variant.id}
                                        quantity={cp.quantity}
                                        increamentCart={this.handleIncreamentCart} />
                                        
                                    </>
                                }
                            </div>

                            <div className="cart-details-container cart-product-stock-status-container">
                                {
                                    cp.product_variant.stock < 5&&
                                    <p className="text-danger">only {cp.product_variant.stock} items left</p>
                                }
                            </div>

                            <div className="cart-details-container cart-product-price">
                                <h6 className="mb-0">
                                    Rs.{cp.product_variant.price-
                                        cp.product_variant.price/100*cp.product_variant.offer}

                                    <div className="text-secondary text-decoration-line-through my-2">Rs.{cp.product_variant.price}</div>
                                    <div className="text-success" >{cp.product_variant.offer}%</div>

                                </h6>
                            </div>
                            <div className="cart-details-container cart-delete-btn text-end">
                                {
                                    <div>
                                        <div hidden={true} className="delete-loader"></div>
                                        <span role="button" onClick={(event)=> this.handleDelete(event,cp.id)} className="text-danger">
                                            <i className="fa fa-trash fa-lg"></i>
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
           </> 
        );
    }
}

export default CartItems;