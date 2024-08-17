import { PureComponent } from "react";
import { Link } from "react-router-dom";

class CheckoutButton extends PureComponent {

    render() {
        const {totalAmount} = this.props
        return (
            <div className="card">
                <div className= {`card-body ${window.innerWidth>500?'d-flex justify-content-between align-items-center':'d-block'}`}>
                    <Link to={'/user/order/checkout/'} className={`btn btn-warning btn-block btn-lg`}>
                        Proceed to Pay
                    </Link>
                    <h5 className={`${window.innerWidth>500?" p-1 me-5":"mt-2"}`}>Total Amount : Rs. {totalAmount}</h5>
                </div>               
            </div>
        );
    }
}

export default CheckoutButton;