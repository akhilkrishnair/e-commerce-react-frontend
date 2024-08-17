import React, { PureComponent } from "react";
import "./PageRouter.css";
import { Header,Footer } from "components/components";
import Products from 'pages/Products/Products'
import Registration from "pages/Register/Registration";
import Login from "pages/LogIn/Login";
import { Routes, Route } from "react-router-dom";
import Dashbord from "pages/Dashboard/Dashbord";
import OrderDetails from "pages/OrderDetails/OrderDetails";
import Cart from "pages/Cart/Cart";
import PageNotFound from "pages/PageNotFound/PageNotFound";
import UserDetailWrapper from "pages/ProductDetails/ProductDetails";
import Checkout from "pages/CheckOut/Checkout";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import EmailVerificationWithParam from "pages/EmailVerification/EmailVerification";
import OrderSuccess from "pages/OrderSuccess/OrderSuccess";
import Home from "pages/Home/Home";
import {UserContext} from "contexts/contexts";


class PageRouter extends PureComponent{

    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            userProfile:null,
            cartChecked:false,
            cartItems:null,
            cartCount:null,
            searchItems:""          
        };
    }

    productSearchManage = (key_words_obj) => {
        // setting the value to searchItem state
        this.setState({searchItems:key_words_obj});
    };

    logInData = (data) => {
        const { email, password, currentUser } = data;
        this.setState({ currentUser: currentUser });
        this.setState({ email: email });
        this.setState({ password: password });
    };


    render() { 
        return (
            <>  
                <Header productSearch={this.productSearchManage} cartCount={this.state.cartCount}/>
               
                <div className="main-container">
                    <Routes>

                        <Route path="/" element={<Home search_item={this.state.searchItems}/>} />

                        <Route path="/:category/" element={<Products/>} />

                        <Route path="/:category/:slug/:color/:size/:id/" element={<UserDetailWrapper/>} />

                        
                        <Route path="/user/registration/" element={<Registration/>} />

                        <Route path="/user/login/" element={<Login login_data={this.logInData} />}/>
                        
                        <Route path="/user/:uidb64/email-verification/:token/" element={<EmailVerificationWithParam/>}/>
                        
                        <Route path="/user/forgot-password/" element={<ForgotPassword/>}/>

                        <Route path="/user/reset-password/:userId/:token/" element={<ResetPassword/>}/>

                        
                        <Route path="/user/dashbord/:menu/" element={<Dashbord />} />


                        <Route path="/user/cart/" element={<Cart />} />


                        <Route path="/user/dashbord/orders/:order_id/:orderId/" element={<OrderDetails/>} />
                        
                        <Route path="/user/order/success/" element={<OrderSuccess/>} />              
                    
                        <Route path="/user/order/checkout/" element={<Checkout userProfile={this.context}/>} />

                        
                        <Route path="/*" element={<PageNotFound/>} />
                        
                    </Routes>

                </div>

               <Footer />
            </>
        );
    }
}

export default PageRouter;
