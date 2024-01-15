import { PureComponent } from "react";
import './css/Checkout.css';
import axios from "axios";


class Checkout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            orderAddress:null,
        };
    }
    componentDidMount(){
        this.fetchOrderAddress();
    }

    fetchOrderAddress(){
        axios.get('http://127.0.0.1:8000/api/order-address/')
        .then((res)=>{
            this.setState({orderAddress:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    render() {
        const {orderAddress} = this.state
        return (
            <>
                <div className="checkout-main-container">
                    <div className="order-address-container">
                        <div className="select-address">
                            <h5 className="bg-primary text-light ps-4 py-1" >Select Address</h5>
                            {   
                                orderAddress&&orderAddress.map((oa)=>(
                                    <div className="each-address">
                                        <input type="radio" name="order-address"/>
                                        <div className="address">
                                            <div>
                                            {
                                               `
                                                   ${oa.full_name}, ${oa.mobile}                                                  
                                               `
                                            }
                                            </div>
                                            {
                                                `
                                                   ${oa.address}
                                                `
                                            }
                                        </div>
                                        <span>Edit</span>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="create-update-new-address btn btn-sm btn-dark mt-2">
                               Add new address
                        </div>

                    </div>
                    <div className="order-details">
                        <h5>Order details</h5>

                    </div>
                </div>
            </>
        );
    }
}

export default Checkout;