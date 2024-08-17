import { PureComponent } from "react";


class QuantityIncreamentButton extends PureComponent {

    render() {

        const {
            cartId,
            productVariantId,
            quantity,
            increamentCart } = this.props

        return (
            <>
            {quantity < 10?
            <button 
            onClick={()=> increamentCart(cartId, productVariantId,"quantity-action-loader-"+cartId)} 
            className="btn btn-primary btn-sm ms-1 px-2">
                <i className="fa fa-plus"></i>
            </button>:
            <button style={{opacity:'0.3',cursor:'no-drop'}} className="btn btn-primary btn-sm ms-1 px-2">
                <i className="fa fa-plus"></i>
            </button>}
            </>
        );
    }
}

export default QuantityIncreamentButton;