import React, { PureComponent } from "react";
import axios from "axios";
import "./Router.css";
import Header from "../Header";
import Footer from "../Footer";
import Products from "../Products";
import Registration from "../Registration";
import Login from "../Login";
import { Routes, Route } from "react-router-dom";
import Dashbord from "../Dashbord";
import Order_Details from "../Order_Details";
import Cart from "../Cart";
import Empty_Page from "../Empty_Page";
import UserDetailWrapper from "../Product_Details";
import Checkout from "../Checkout";
import { access_token } from "../../App";
import ForgotPassword from "../Forgot_Password";
import ResetPassword from "../Reset_password";
import EmailVerificationWithParam from "../Email_verification";
import OrderSuccess from "../OrderSuccess";
import FilterHandler from "../Products";



class Router extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            userProfile:null,
            email: "",
            password: "",
            cartChecked:false,
            cartItems:null,
            cartCount:null,
            searchItems:""
            
        };
    }

    componentDidMount() {
        if (access_token){
            this.fetchProfile();
            this.fetchCart();             
        }
    };

    productSearchManage = (key_words_obj) => {
        // setting the value to searchItem state
        this.setState({searchItems:key_words_obj});
    };

    fetchProfile = () => {
        axios
        .get("http://127.0.0.1:8000/api/user/profile/")
        .then((res) => {
            if (res.status===200){
                this.setState({ currentUser: true });
                this.setState({userProfile:res.data})
                this.cartCount();
                return res
            }
            this.setState({currentUser:false})
        })
        .catch((error) => {
            console.log(error);
            this.setState({ currentUser: false });
        });

    }

    fetchCart = async ()=> {
        const cart = await  axios
            .get("http://127.0.0.1:8000/api/cart/")
            .then((res) => {                
                this.setState({ cartItems: res.data });
                this.setState({cartChecked:true});
                return res.data                
            })
            .catch((error) => {
                console.log(error);
                this.setState({ cartChecked: false });
            });
        
        return cart
           
    }

    logInData = (data) => {
        const { email, password, currentUser } = data;
        this.setState({ currentUser: currentUser });
        this.setState({ email: email });
        this.setState({ password: password });
    };

    cartCount=()=>{
        axios.get('http://127.0.0.1:8000/api/cart/count/',
        ).then((res) => {
            this.setState({cartCount:res.data});
        }).catch((err) => {
            console.log(err);
        })
    };

    setCurrentUser = (user)=>{
        this.setState({currentUser:user})
    };



    render() { 
        return (
            <>  
                    <Header 
                        product_search={this.productSearchManage}
                        set_current_user = {this.setCurrentUser}
                        current_user={this.state.currentUser} 
                        cart_count={this.state.cartCount} />
               
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<FilterHandler currentUser={this.state.currentUser} />} />
                        <Route path="/" element={<Products search_item={this.state.searchItems} />} />
                        <Route path="/:category/" element={<Products  search_item={this.state.searchItems} />} />
                        <Route path="/user/registration/" element={<Registration />} />
                        <Route path="/user/forgot-password/" element={<ForgotPassword/>} />
                        <Route path="/user/reset-password/:userId/:token/" element={<ResetPassword/>}/>
                        <Route path="/user/:uidb64/email-verification/:token/" element={<EmailVerificationWithParam/>}/>

                        {!this.state.currentUser&&
                            <Route
                                path="/user/login/"
                                element={<Login current_user={this.state.currentUser} login_data={this.logInData} />}
                            />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/dashbord/:menu/" element={<Dashbord  />} />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/cart/" element={<Cart cart_counter={this.cartCount} fetch_cart={this.fetchCart} cart_checked={this.state.cartChecked} />} />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/dashbord/orders/:order_id/" element={<Order_Details/>} />
                        }
                        
                             <Route path="/:category/:slug/:color/:size/:id/" element={<UserDetailWrapper current_user={this.state.currentUser} cart_counter={this.cartCount} />} />
                             <Route path="/*" element={<Empty_Page/>} />
                        {
                            this.state.currentUser&&
                            <Route path="/user/order/success/" element={<OrderSuccess/>} />
                        }


                         {
                            this.state.cartCount&&
                            <Route path="/user/order/checkout/" 
                                element={<Checkout 
                                user_profile={this.state.userProfile} 
                                fetch_cart={this.fetchCart} 
                                cart_items={this.state.cartItems}
                                cart_counter={this.cartCount}  />} />
                        }
                    </Routes>
                </div>
                <Footer />
            </>
        );
    }
}

export default Router;
