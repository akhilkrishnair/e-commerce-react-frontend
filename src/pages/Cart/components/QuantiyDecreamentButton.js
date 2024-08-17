import { PureComponent } from "react";


class QuantityDecreamentButton extends PureComponent {

    render() {

        const {
            cartId,
            productVariantId,
            quantity,
            decreamentCart } = this.props

        return (
            <>
            {quantity > 1?
            <button 
            onClick={()=> decreamentCart(cartId, productVariantId, "quantity-action-loader-"+cartId)} 
            className="btn btn-primary btn-sm me-1 px-2">
                <i className="fa fa-minus"></i>
            </button>:
            <button 
            style={{opacity:'0.3',cursor:'no-drop'}} 
            className="btn btn-primary btn-sm me-1 px-2">
                <i className="fa fa-minus"></i>
            </button>}
            </>
        );
    }
}

export default QuantityDecreamentButton;