import axios from "axios";
import { Component } from "react";
import { useParams } from "react-router";
import "./css/Order_Details.css";
import { Link } from "react-router-dom";

class Order_Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders() {
        axios
            .get("http://127.0.0.1:8000/api/orders/", { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                this.setState({ orders: res.data });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { orders } = this.state;
        const singleOrder = orders.find((o) => {
            return o.order_id == this.props.order_id;
        });
        console.log(singleOrder);

        return (
            <div className="order-details-main-container">
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
                </div>
                <br />
                <hr />

                <div className="order-product-container">
                    <div className="order-product-image-container">
                        <Link 
                            to={
                                singleOrder&&
                                `/${singleOrder.product_variant.product_color_variant.product.category.slug}/${singleOrder.product_variant.product_color_variant.product.slug}/${singleOrder.product_variant.product_color_variant.color.name}/${singleOrder.product_variant.size.name}/`
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

                        <div className="order-status-progress">
                            <p>{singleOrder&&singleOrder.status} </p>

                            {
                                singleOrder&&singleOrder.status == 'Pending'&&

                                    <div className="status-progress-bar">
                                        <div className="custom-progress-bar">

                                        </div>
                                    </div>
                            }
                            {
                                singleOrder&&singleOrder.status == 'Packed'&&

                                    <div className="status-progress-bar">
                                        <div className="custom-progress-bar packed">

                                        </div>
                                    </div>
                            }
                            {
                                singleOrder&&singleOrder.status == 'Shipped'&&

                                    <div className="status-progress-bar">
                                        <div className="custom-progress-bar shipped">

                                        </div>
                                    </div>
                            }
                            {
                                singleOrder&&singleOrder.status == 'Out For Delivery'&&

                                    <div className="status-progress-bar">
                                        <div className="custom-progress-bar out-for-delivery">

                                        </div>
                                    </div>
                            }



                                   <div className="status-conditions">
                                        <span>Pending</span>
                                        <span>Packed</span>
                                        <span>Shipped</span>
                                        <span>Out for Delivery</span>
                                       
                                    </div>

                        </div>
                      

                    </div>
                </div>
            </div>
        );
    };
};

function OrdersDetailParam() {
    const { order_id } = useParams();
    return <Order_Details order_id={order_id} />;
}
export default OrdersDetailParam;
