import { PureComponent } from "react";
import './css/Checkout.css';
import axios from "axios";
import PaymentComponent from "./Payment";
import { baseUrl } from "../App";
import { Navigate } from "react-router";


const address_data = {
    id:null,
    full_name:"",
    mobile:"",
    pincode:"",
    locality:"",
    address:"",
    city_district_town:"",
    state:"",
    landmark:"",
}




class Checkout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            orderAddress:null,
            updatingAddress:null,
            addAddressForm:false,
            updateAddressBtn:false,
            addressSubmiting:true,
            cartItems:null,
            outOfStock:false,
            amount:null,
            discount:null,
            totalAmount:null,
            address:{...address_data},
            orderData:{
                selectedOrderAddressId:null,
                selectedPaymentMethod:null,
            },
            orderSuccess:null,
        };
    }

    

    componentDidMount(){
        window.scrollTo(0,0)
        this.fetchOrderAddress();
        this.fetchCart();
    }

    componentDidUpdate(prop,state){
        if (state.cart=== this.state.cart){
            this.orderDetailsCalculation();
        }
    };

    resetState(){
        let initial_address = this.state.address
        initial_address = {...address_data}
        this.setState({...this.state.address,address:initial_address})
        
        this.selectedAddressClose();
    };

    selectedAddressClose = () => {
        let id = this.state.orderData
        id.selectedOrderAddressId = null
        this.setState({...this.state.orderData, orderData:id})
    }

    fetchCart = () => {
        this.props.fetch_cart().then((res)=>{
            this.setState({cartItems:res})
        })      
    };

    fetchOrderAddress(){
        axios.get(baseUrl+'order-address/')
        .then((res)=>{
            this.setState({orderAddress:res.data})
        })
        .catch((err)=>{
        })
    }

    orderDetailsCalculation(){
        let calc_amount = 0
        let calc_discount = 0
        let total_amount = 0

        this.state.cartItems&&this.state.cartItems.forEach((element) => {
            if (element.product_variant.stock < element.quantity){
                this.setState({outOfStock:true})
            } 
            calc_discount += ((element.product_variant.price/100)*element.product_variant.offer)*element.quantity
            calc_amount += (element.quantity * element.product_variant.price)
        });
        total_amount = calc_amount-calc_discount+50
        this.setState({amount:calc_amount})
        this.setState({discount:calc_discount})
        this.setState({totalAmount:total_amount})
    }

    // this function is called in the update switch case of showHideAddAddress function
    updateAddress = (address_id)=>{
        let updatingAdrs = this.state.orderAddress.find((oa)=>{
            return oa.id === address_id
        })
        let add_address = this.state.address
        add_address = updatingAdrs
        this.setState({...this.state.address,address:add_address})
        
    }

    showHideAddAddress=(action,address_id)=>{
        switch(action){
            case 'add':
                this.setState({addAddressForm:true,updateAddressBtn:false});
                this.setState({updatingAddress:null})
                this.selectedAddressClose();

                break;            
            case 'close':
                if (this.state.address.full_name){
                    this.resetState();
                }
                this.setState({addAddressForm:false});
                break;
            case 'update':
                this.setState({addAddressForm:true,updateAddressBtn:true});
                this.updateAddress(address_id);

        }
    }

    onChangeAddressAdd = (event)=>{

        const {name,value} = event.target
        
        let add_address = this.state.address
        add_address[name] = value
        this.setState({...this.state.address,address:add_address})
    }

    addressSubmit =(action)=>{
        if (this.state.addressSubmiting){
            this.setState({addressSubmiting:false})
            const {full_name,
                mobile,
                city_district_town,
                locality,
                landmark,
                pincode,
                state,
                address,
                id} = this.state.address
    
                const addressData = {
                    full_name:full_name,
                    mobile:mobile,
                    pincode:pincode,
                    locality:locality,
                    address:address,
                    city_district_town:city_district_town,
                    state:state,
                    landmark:landmark,
                    user:this.props.user_profile.id,
                }
                
                switch(action){
                    case 'create':
                        axios.
                        post(baseUrl+"order-address/",
                        addressData 
                        ).then((response)=>{
                            this.setState({addAddressForm:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                        })
                        this.setState({addressSubmiting:true})
                        break;
                    
                    case 'update':
                        axios.
                        put(baseUrl+`order-address/${id}/`,
                        addressData
                        ).then((response)=>{
                            this.setState({addAddressForm:false})
                            this.setState({updateAddressBtn:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                        })
                        this.setState({addressSubmiting:true})
                        break;
    
                    case 'delete':
                        axios.
                        delete(baseUrl+`order-address/${id}/`,
                        ).then((response)=>{
                            this.setState({addAddressForm:false})
                            this.setState({updateAddressBtn:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                        });
                        this.setState({addressSubmiting:true})
                        break;
    
                }
        }

    };

    orderAddressIdSave = (address_id) => {
        let id = this.state.orderData
        id.selectedOrderAddressId = address_id
        this.setState({...this.state.orderData, orderData:id})
    };


    outOfStockHandle = (message) => {
        if (message){
            this.setState({outOfStock:true})
        }
    }


    paymentMethodSelectionHandle = (payment_method) => {
        let payment = this.state.orderData
        payment.selectedPaymentMethod = payment_method
        this.setState({...this.state.orderData, payment})
    };


    cashOnDeliveryHandle = () => {

        const data = {
            order_address_id:this.state.orderData.selectedOrderAddressId
        }

        axios.
        post(baseUrl+"order/cash-on-delivery/",data)
        .then((res) => {
            this.props.cart_counter();
            this.setState({orderSuccess:"/user/order/success/"})
        }).catch((err) => {
        })
    }

    render() {
        const {orderAddress,
            addAddressForm,
            updateAddressBtn,
            address,
            cartItems,
            amount,
            discount,
            totalAmount,
            orderData,
            outOfStock,
            orderSuccess} = this.state

            if (orderSuccess){
                return <Navigate to={orderSuccess} />
            }

        return (
            <>

                    <div className="checkout-main-container">
                        <div className="order-address-container">
                            <div className="select-address">
                                <h4 className="bg-primary text-light ps-4 py-2 mb-3" >Select Address</h4>
                                {   
                                    !addAddressForm&&orderAddress&&orderAddress.map((oa)=>(
                                        <div key={oa.id} className="each-address mb-2">
                                            <input onClick={()=>this.orderAddressIdSave(oa.id)} type="radio" name="order-address"/>
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
                                            <span 
                                            onClick={()=>this.showHideAddAddress('update',oa.id)} 
                                            className="address-edit-btn" 
                                            >
                                                Edit
                                            </span>
                                        </div>
                                    ))
                                }

                            </div>

                            {   
                                !addAddressForm&&
                                <div 
                                className="create-update-new-address btn btn-sm btn-success mt-2"
                                onClick={()=>this.showHideAddAddress('add')}>
                                        Add new address
                                </div>
                            }
                            
                            
                            {
                                addAddressForm&&
                                <div className="row mt-3">
                                        <div className=" mb-4">
                                            <div className="card mb-4">
                                            <div className="card-header py-2">
                                                <h5 className="mb-0">Add new address</h5>
                                            </div>
                                            <div className="card-body">
                                                <form >
                                                {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                                                <div className="row mb-3">
                                                    <div className="col">
                                                    <div className="form-outline">
                                                        <input 
                                                        onChange={this.onChangeAddressAdd}
                                                        value={address.full_name}
                                                        name="full_name" 
                                                        type="text" 
                                                        id="form7Example1" 
                                                        className="form-control form-control-sm" />
                                                        <label className="form-label" for="form7Example1">Full name</label>
                                                    </div>
                                                    </div>
                                                    
                                                </div>
                                                
                                                {/* <!-- Number input --> */}
                                                <div className="row">
                                                    <div className="col">                       
                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.mobile}
                                                    name="mobile"
                                                    type="number" 
                                                    id="form7Example6" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example6">Phone</label>
                                                </div>
                                                </div>  


                                                {/* <!-- Text input --> */}
                                                <div className="col">
                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.city_district_town}
                                                    name="city_district_town"
                                                    type="text" 
                                                    id="form7Example4" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example4">City/ District/ Town</label>
                                                </div>
                                                </div>
                                                </div>

                                                {/* <!-- Text input --> */}
                                                <div className="row">
                                                    <div className="col">                       

                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd}
                                                    value={address.locality}
                                                    name="locality" 
                                                    type="text" 
                                                    id="form7Example3" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example3">Locality </label>
                                                </div>
                                                </div>

                                                {/* <!-- Landmark input --> */}
                                                <div className="col">
                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.landmark}
                                                    name="landmark"
                                                    type="text" 
                                                    id="form7Example5" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example5">Landmark</label>
                                                </div>
                                                </div>
                                                </div>

                                                {/* <!-- PIN input --> */}

                                                <div className="row">
                                                    <div className="col">                       

                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.pincode}
                                                    name="pincode"
                                                    type="number" 
                                                    id="form7Example5" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example5">PIN</label>
                                                </div>
                                                </div>

                                                {/* <!-- State input --> */}
                                                <div className="col">
                                                <div className="form-outline mb-3">
                                                    <input 
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.state}
                                                    name="state"
                                                    type="text" 
                                                    id="form7Example5" 
                                                    className="form-control form-control-sm" />
                                                    <label className="form-label" for="form7Example5">State</label>
                                                </div>
                                                </div>
                                                </div>




                                                {/* <!-- Message input --> */}
                                                <div className="form-outline mb-3">
                                                    <textarea
                                                    onChange={this.onChangeAddressAdd} 
                                                    value={address.address}
                                                    name="address" 
                                                    className="form-control form-control-sm" 
                                                    id="form7Example7" 
                                                    rows="4"></textarea>
                                                    <label className="form-label" for="form7Example7">Address</label>
                                                </div>

                                                {/* <!-- Checkbox --> */}
                                                {
                                                    !updateAddressBtn?
                                                    <span
                                                    onClick={() => this.addressSubmit('create')} 
                                                    className="btn btn-sm btn-success"
                                                    >Save Address</span>:
                                                    
                                                    <>
                                                    <span
                                                    onClick={() => this.addressSubmit('update')} 
                                                    className="btn btn-sm btn-success"
                                                    >Update Address</span>
                                                    {
                                                        orderAddress.length > 1 &&
                                                        <span
                                                        onClick={() => this.addressSubmit('delete')} 
                                                        className="btn btn-sm btn-danger float-end"
                                                        >Delete Address</span>
                                                    }
                                                    </>

                                                }

                                                </form>
                                            </div>
                                            </div>
                                        </div>                            
                                    </div>
                            }


                            {   
                                addAddressForm&&
                                <div 
                                className="create-update-new-address btn btn-sm btn-dark mt-2"
                                onClick={()=>this.showHideAddAddress('close')}>
                                        Close
                                </div>
                            }
                            <h4 className="bg-primary text-light ps-4 py-2 mb-3 mt-4" >Payment method</h4>
                            

                            {
                                !outOfStock&&orderData.selectedOrderAddressId&&
                                <div className="payment-method-container">
                                    <div className="payment-container">
                                        <input 
                                        type="radio" 
                                        name="payment-method"
                                        onClick={()=>this.paymentMethodSelectionHandle("razorpay")} />
                                        <div className="payment">
                                            <div>Razorpay Card/Net-Banking</div>
                                        </div>
                                        {
                                            orderData.selectedPaymentMethod === "razorpay"&&
                                            <PaymentComponent 
                                            cart_items={cartItems} 
                                            order_address_id={orderData.selectedOrderAddressId}
                                            fetch_cart={this.props.fetch_cart}
                                            cart_counter={this.props.cart_counter}
                                            out_of_stock_handle={this.outOfStockHandle} />
                                        }
                                    </div>

                                    <div className="payment-container">
                                        <input 
                                        type="radio" 
                                        name="payment-method"
                                        onClick={()=>this.paymentMethodSelectionHandle("cash-on-delivery")} />
                                        <div className="payment" >
                                            <div>Cash on delivery</div>
                                        </div>
                                        {
                                            orderData.selectedPaymentMethod === "cash-on-delivery"&&
                                            <button 
                                                className="btn btn-primary w-50"
                                                onClick={this.cashOnDeliveryHandle} >
                                                Place order
                                            </button>
                                        }
                                    </div>
                                </div>
                            }


                        </div>
                        <div className="order-details">
                            <h5>Order details</h5>
                            {
                                !outOfStock?
                                <div className="item-details">
                                    <div className="amount-container">
                                        <div className="amount-title">
                                        Amount ({cartItems&&cartItems.length>1?cartItems.length+" items":"1 item"})
                                        
                                        </div>
                                        <div className="amount">
                                            Rs.{amount&&amount}
                                        </div>
                                    </div>
                                    <div className="discount-container">
                                        <div className="discount-title">
                                        Discount
                                        </div>
                                        <div className="discount">
                                            -Rs.{discount&&discount}
                                        </div>
                                    </div>
                                    <div className="delivery-charge-container">
                                        <div className="title">
                                            Delivery Charge
                                        </div>
                                        <div className="delivery-amount">
                                            50
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="total-amount-container">
                                        <h6 className="title">
                                            Total amount
                                        </h6>
                                        <h6 className="total-amount">
                                            Rs.{totalAmount&&totalAmount}
                                        </h6>
                                    </div>
                                    <hr/>
                                </div>:

                                <div className="item-details">
                                    Some items out of stock check cart
                                </div>
                            }

                        </div>
                    </div>

            </>
        );
    }
}

export default Checkout;