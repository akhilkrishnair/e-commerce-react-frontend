import { PureComponent } from "react";
import './css/Checkout.css';
import axios from "axios";

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
            csrf_token:"",
            orderAddress:null,
            updatingAddress:null,
            addAddressForm:false,
            updateAddressBtn:false,
            addressSubmiting:true,
            cartItems:null,
            amount:null,
            discount:null,
            totalAmount:null,
            address:{...address_data},
            // copy_of_address_data:{...address_data}

        };
    }

    

    componentDidMount(){
        this.fetchOrderAddress();
        this.setState({csrf_token:this.getCookie('csrftoken')});
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
        console.log("initial ",initial_address)
        this.setState({...this.state.address,address:initial_address})
    };

    fetchCart = () => {
        this.props.fetch_cart().then((res)=>{
            this.setState({cartItems:res})
        })      
    };

    fetchOrderAddress(){
        axios.get('http://127.0.0.1:8000/api/order-address/')
        .then((res)=>{
            this.setState({orderAddress:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    orderDetailsCalculation(){
        let calc_amount = 0
        let calc_discount = 0
        let total_amount = 0

        this.state.cartItems&&this.state.cartItems.forEach((element) => {
            calc_discount += ((element.product_variant.price/100)*element.product_variant.offer)*element.quantity
            calc_amount += (element.quantity * element.product_variant.price)
        });
        total_amount = calc_amount-calc_discount+50
        this.setState({amount:calc_amount})
        this.setState({discount:calc_discount})
        this.setState({totalAmount:total_amount})
    }

    getCookie (cookieName){
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
      
          // Check if the cookie starts with the specified name
          if (cookie.startsWith(cookieName + '=')) {
            // Return the value of the cookie
            return cookie.substring(cookieName.length + 1);
          }
        }
      
        // Return null if the cookie is not found
        return null;
    };


    // this function is called in the update switch case of showHideAddAddress function
    updateAddress = (address_id)=>{
        let updatingAdrs = this.state.orderAddress.find((oa)=>{
            return oa.id === address_id
        })
        let add_address = this.state.address
        add_address = updatingAdrs
        this.setState({...this.state.address,address:add_address})
        
        console.log(this.state.address)
    }

    showHideAddAddress=(action,address_id)=>{
        switch(action){
            case 'add':
                this.setState({addAddressForm:true,updateAddressBtn:false});
                this.setState({updatingAddress:null})
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
        console.log("onchange ", this.state.address)
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
                        post("http://127.0.0.1:8000/api/order-address/",
                        addressData,
                        {
                            headers:{
                                'X-CSRFToken':this.state.csrf_token
                            },
                        }).then((response)=>{
                            console.log(response.data)
                            this.setState({addAddressForm:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                            console.log(error)
                        })
                        this.setState({addressSubmiting:true})
                        break;
                    
                    case 'update':
                        axios.
                        put(`http://127.0.0.1:8000/api/order-address/${id}/`,
                        addressData,
                        {
                            headers:{
                                'X-CSRFToken':this.state.csrf_token
                            }
                        }).then((response)=>{
                            console.log(response.data)
                            this.setState({addAddressForm:false})
                            this.setState({updateAddressBtn:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                            console.log(error)
                        })
                        this.setState({addressSubmiting:true})
                        break;
    
                    case 'delete':
                        axios.
                        delete(`http://127.0.0.1:8000/api/order-address/${id}/`,
                        {
                            headers:{
                                'X-CSRFToken':this.state.csrf_token
                            }
                        }
                        ).then((response)=>{
                            console.log(response.data)
                            this.setState({addAddressForm:false})
                            this.setState({updateAddressBtn:false})
                            this.resetState();
                            this.fetchOrderAddress();
                        }).catch((error)=>{
                            console.log(error)                       
                        });
                        this.setState({addressSubmiting:true})
                        break;
    
                }
        }

    };

    render() {
        console.log("render ",this.state)
        const {orderAddress,
            addAddressForm,
            updateAddressBtn,
            address,
            cartItems,
            amount,
            discount,
            totalAmount} = this.state
        return (
            <>
                <div className="checkout-main-container">
                    <div className="order-address-container">
                        <div className="select-address">
                            <h4 className="bg-primary text-light ps-4 py-2 mb-3" >Select Address</h4>
                            {   
                                !addAddressForm&&orderAddress&&orderAddress.map((oa)=>(
                                    <div className="each-address mb-2">
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


                    </div>
                    <div className="order-details">
                        <h5>Order details</h5>
                        
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
                            <div className="checkout-btn btn btn-warning w-100 fw-bold">
                                PLACE ORDER
                            </div>


                        </div>

                    </div>
                </div>
            </>
        );
    }
}

export default Checkout;