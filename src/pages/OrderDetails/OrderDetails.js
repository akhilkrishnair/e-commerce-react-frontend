import { PureComponent } from "react";
import { useParams } from "react-router";
import "./OrderDetails.css";
import { Link } from "react-router-dom";
import { webSocketUrl } from "App";
import {axiosWithAuthentication} from "intersepter/axios";
import withAuthentication from "utils/withAuthentication";
import { renderProductName } from "utils/productUtills";


class OrderDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            singleOrder:null,
        };
        this.ws = null
    }

    componentDidMount() {
        this.fetchOrders();
    }

    componentWillUnmount(){
        if (this.ws){
            this.ws.close();
        }
    }

    webSocketConnection = (user_id) => {
        this.ws = new WebSocket(`${webSocketUrl}${user_id}/`)

        this.ws.onopen = () => {
        }

        this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            if (data.type === 'order_update'){
                this.fetchOrders();
            }
        }

        this.ws.onclose = () => {}      
    }

    fetchOrders = () => {
        this.setState({orderLoader:true})
        axiosWithAuthentication
        .get(`orders/?orderId=${this.props.orderId}`)
        .then((res) => {
            this.setState({ singleOrder: res.data[0] });
            if(!this.ws){
                this.webSocketConnection(res.data[0].user_id)
            }
        })
        .catch((error) => {})
    }

    cancelOrder = (order_id) => {
        axiosWithAuthentication
        .get(`orders/?order_id=${order_id}`)
        .then((res) => {
            this.setState({singleOrder:res.data[0]})
        }).catch((err) => {

        })
    }

    renderSingleOrderImage = (singleOrder) => {
        if(singleOrder){
            if(singleOrder.product_variant.product_color_variant.image1){
                return singleOrder.product_variant.product_color_variant.image1
            }
            return singleOrder.product_variant.product_color_variant.product.image_main
        }
    };

    renderOrderStatus = (singleOrder) => {
        if(singleOrder){
            if(singleOrder.status === 'Out For Delivery' && singleOrder.status === 'Delivered'){
                return <div className="status-progress-bar">
                            <div className="custom-progress-bar out-for-delivery"></div>
                        </div>
            }
        }
        return null
    }


    render() {
        const {singleOrder} = this.state

        return (
            <div className="order-details-main-container">
                <h3 className="text-center mb-5">Order Details</h3>
                {
                    singleOrder?
                    <div className="delivery-address-container">
                        <h5 className="mb-4">Delivery Address</h5>
                        <p>Name :{singleOrder && " " + singleOrder.order_address.full_name}</p>
                        <p>Mobile :{singleOrder && " " + singleOrder.order_address.mobile}</p>
                        <p>
                            {singleOrder &&
                                `${singleOrder.order_address.state},
                            ${singleOrder.order_address.city_district_town},
                            ${singleOrder.order_address.locality}, 
                            ${singleOrder.order_address.address}`}
                            <br />
                            PIN :{singleOrder && " " + singleOrder.order_address.pincode}
                        </p>
                    </div>:
                    <div className="order-details-loader"></div>
                }
                <br />
                <hr />
                
                {
                    singleOrder?
                    <div className="order-product-container">
                        <div className="order-product-image-container">
                            <Link 
                                to={
                                    singleOrder&&
                                    `/${singleOrder.product_variant.product_color_variant.product.category.slug}/${singleOrder.product_variant.product_color_variant.product.slug}/${singleOrder.product_variant.product_color_variant.color.name}/${singleOrder.product_variant.size.name}/${singleOrder.product_variant.product_color_variant.product.id}/`
                                } 
                                className="order-product-image">
                                    <img
                                        src={this.renderSingleOrderImage(singleOrder)}
                                        alt="order-product.jpg"
                                    />
                            </Link >
                        </div>

                        {
                            singleOrder&&singleOrder.status !== 'Cancelled'? 
                            <div className="order-product-details-container">
                                <h6>{renderProductName({product:singleOrder.product_variant})} </h6>
                                <h6>
                                    { singleOrder &&
                                        `Rs. ${singleOrder.price_was}`}
                                </h6>
                                <p>Order ID :{singleOrder && " " + singleOrder.order_id}</p>
                                <p>
                                    Payment mode : {singleOrder&&singleOrder.payment.payment_mode}
                                    <br/>
                                    { singleOrder&&singleOrder.payment.paid===false?"Payment status : Pending":"Payment status : Paid"}
                                </p>

                                <button
                                onClick={() => this.cancelOrder(singleOrder&&singleOrder.id)} 
                                style={{'position':'relative','left':'60%'}} 
                                className="btn btn-danger my-4">
                                    Cancel this order
                                </button>

                                <div className="order-status-progress">
                                    <p className={singleOrder&&singleOrder.status === 'Delivered'?'fw-bold text-success':'fw-bold'}>
                                        {singleOrder&&singleOrder.status} 
                                    </p>

                                    {singleOrder&&singleOrder.status === 'Pending'&&
                                        <div className="status-progress-bar">
                                            <div className="custom-progress-bar"></div>
                                        </div>}

                                    {singleOrder&&singleOrder.status === 'Packed'&&
                                        <div className="status-progress-bar">
                                            <div className="custom-progress-bar packed"></div>
                                        </div>}

                                    {singleOrder&&singleOrder.status === 'Shipped'&&
                                        <div className="status-progress-bar">
                                            <div className="custom-progress-bar shipped"></div>
                                        </div>}

                                    {this.renderOrderStatus(singleOrder)}

                                    <div className="status-conditions">
                                        <span 
                                        className={singleOrder&&singleOrder.status === 'Pending'?'text-success':null} >
                                            Pending
                                        </span>
                                        <span 
                                        className={singleOrder&&singleOrder.status === 'Packed'?'text-success':null} >
                                            Packed
                                        </span>
                                        <span 
                                        className={singleOrder&&singleOrder.status === 'Shipped'?'text-success':null} >
                                            Shipped
                                        </span>
                                        <span 
                                        className={singleOrder&&singleOrder.status === 'Out For Delivery'?'text-success':null} >
                                            Out for Delivery
                                        </span>
                                    </div>

                                </div>
                            

                            </div>:

                            <div className="mt-5">
                                <h6>You Cancelled this Order</h6>
                            </div>
                        }
                    </div>:
                    <div className="order-details-loader"></div>
                }
            </div>
        );
    };
};

function OrdersDetailParam() {
    const { order_id, orderId } = useParams();
    return <OrderDetails order_id={order_id} orderId={orderId} />;
}
export default withAuthentication(OrdersDetailParam);
