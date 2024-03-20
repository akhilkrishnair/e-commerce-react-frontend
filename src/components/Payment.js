// PaymentComponent.js
import React, { PureComponent } from 'react';
import axios from 'axios';
import  { Navigate } from 'react-router-dom';
import './css/Payment.css';
import { baseUrl } from '../App';




class PaymentComponent extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            orderSuccess:null,
            loader:false,
            razorOrderLimitError:""
        };
    };

    handleOrderSuccess = () => {
        this.setState({orderSuccess:"/user/order/success/"})
    };

    initiatePayment = async () => {
        this.setState({loader:true})

        const {order_address_id,       
            cart_counter,
            fetch_cart} = this.props
        try {
            const response = await axios.post( baseUrl+'razorpay-payment-request/',
            {order_address_id:order_address_id})

            this.setState({amount:response.data.razor_order.amount})

            const options = {
                key: 'rzp_test_L8VApKZTzn8SO7',
                amount: response.data.razor_order.amount,
                currency: 'INR',
                name: 'E-Shop',
                description: 'Payment for your product/service',
                order_id: response.data.razor_order.id,
                handler:  (res) => {  
                    // Handle successful payment
                    const orderData = {
                        cart_payment:response.data.cart_payment,
                        order_address_id:order_address_id&&order_address_id,
                        razorpay_order_id:res.razorpay_order_id,
                        razorpay_payment_id:res.razorpay_payment_id,
                        razorpay_signature:res.razorpay_signature                        
                    }

                    axios.
                    put(baseUrl+'order-confirm/',
                        orderData
                    ).then((res)=>{
                        fetch_cart();
                        cart_counter();
                        console.log('order succ ', this.state)
                        this.handleOrderSuccess();
                    }).catch((error)=>{
                        console.log(error)
                    }); 
          
                },
                prefill: {
                    name: response.data.user.full_name,
                    email: response.data.user.email,
                    contact: '99999999',
                },
                theme: {
                    color: '#3399cc',
                },
                modal:{
                    ondismiss: async ()=>{
                       await axios
                       .post(baseUrl+"razorpay-payment-fail/",
                       {payment_id:response.data.cart_payment.payment_id})
                       .then((resp) => {
                        console.log(resp)
                       }).catch((err) => {
                        console.log(err)
                       })
                    }
                }               
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();
            

        } catch (error) {
            console.error('Error initiating payment:', error);
            if (error.response.data.message === "stock_error"){
                this.props.out_of_stock_handle(true)
            }else{
                this.setState({razorOrderLimitError:error.response.data.message})
            }
        } finally {
            this.setState({loader:false})
        };


    };


    render() {
        if (this.state.orderSuccess){
            return <Navigate to={this.state.orderSuccess} />;
        }
        return(
                <>
                    {   
                        !this.state.loader?
                        <div className='w-50'>
                            <button className='btn btn-primary w-100' onClick={this.initiatePayment}>
                                {
                                    this.state.razorOrderLimitError?this.state.razorOrderLimitError:"Pay Now"
                                }                    
                            </button>
                        </div>:
                        <div className='w-50'>
                            <div className='payment-loader'></div>
                        </div>
                    }
                </>

        )
    };
};

export default PaymentComponent;


