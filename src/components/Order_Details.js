import axios from "axios";
import { PureComponent } from "react";
import { useParams } from "react-router";
import "./css/Order_Details.css";
import { Link } from "react-router-dom";
import { baseUrl,webSocketUrl } from "../App";


class Order_Details extends PureComponent {
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
            console.log('connection opened')
        }

        this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            if (data.type === 'order_update'){
                this.fetchOrders();
            }
        }

        this.ws.onclose = () => {
            console.log('connection closed')
        }
        
    }


    fetchOrders = () => {
        this.setState({orderLoader:true})
        axios
        .get(baseUrl+"orders/", { withCredentials: true })
        .then((res) => {
            const singleOrder = res.data.find((o) => {
                return o.order_id == this.props.order_id;
            });
            this.setState({ singleOrder: singleOrder });
            if(!this.ws){
                this.webSocketConnection(singleOrder.user_id)
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    cancelOrder = (order_id) => {
        axios
        .get(`${baseUrl}orders/?order_id=${order_id}`)
        .then((res) => {
            this.setState({singleOrder:res.data[0]})
        }).catch((err) => {

        })
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
                                        src={
                                            singleOrder && singleOrder.product_variant.product_color_variant.image1||
                                            singleOrder && singleOrder.product_variant.product_color_variant.product.image_main
                                        }
                                    />
                            </Link >
                        </div>


                        {
                            singleOrder&&singleOrder.status !== 'Cancelled'? 
                            <div className="order-product-details-container">
                                <h6>
                                    {singleOrder &&
                                        `${singleOrder.product_variant.product_color_variant.product.name} 
                                        (${singleOrder.product_variant.product_color_variant.color.name}, ${singleOrder.product_variant.size.name})`}
                                </h6>
                                <h6>
                                    {
                                        singleOrder &&
                                        `Rs. ${singleOrder.price_was}`
                                    }
                                </h6>
                                <p>Order ID :{singleOrder && " " + singleOrder.order_id}</p>
                                <p>
                                    Payment mode : {singleOrder&&singleOrder.payment.payment_mode}
                                    <br/>
                                    {
                                        singleOrder&&singleOrder.payment.paid===false?"Payment status : Pending":"Payment status : Paid"
                                    }
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

                                    {
                                        singleOrder&&singleOrder.status === 'Pending'&&

                                            <div className="status-progress-bar">
                                                <div className="custom-progress-bar">

                                                </div>
                                            </div>
                                    }
                                    {
                                        singleOrder&&singleOrder.status === 'Packed'&&

                                            <div className="status-progress-bar">
                                                <div className="custom-progress-bar packed">

                                                </div>
                                            </div>
                                    }
                                    {
                                        singleOrder&&singleOrder.status === 'Shipped'&&

                                            <div className="status-progress-bar">
                                                <div className="custom-progress-bar shipped">

                                                </div>
                                            </div>
                                    }
                                    {
                                        singleOrder&&singleOrder.status === 'Out For Delivery'||
                                        singleOrder&&singleOrder.status === 'Delivered'?

                                            <div className="status-progress-bar">
                                                <div className="custom-progress-bar out-for-delivery">

                                                </div>
                                            </div>:null
                                    }


                                        <div className="status-conditions">
                                            <span className={singleOrder&&singleOrder.status === 'Pending'?'text-success':null} >Pending</span>
                                            <span className={singleOrder&&singleOrder.status === 'Packed'?'text-success':null} >Packed</span>
                                            <span className={singleOrder&&singleOrder.status === 'Shipped'?'text-success':null} >Shipped</span>
                                            <span className={singleOrder&&singleOrder.status === 'Out For Delivery'?'text-success':null} >Out for Delivery</span>
                                        
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
    const { order_id } = useParams();
    return <Order_Details order_id={order_id} />;
}
export default OrdersDetailParam;
