import React, { PureComponent, Suspense, lazy } from "react";
import "./PageRouter.css";

import { UserContext } from "contexts/contexts";
import { Route, Routes } from "react-router-dom";
import { Header, Footer } from "components/components";
const Home = lazy(() => import("pages/Home/Home"));

const Products = lazy(() => import("pages/Products/Products"));
const Registration = lazy(() => import("pages/Register/Registration"));
const Login = lazy(() => import("pages/LogIn/Login"));
const Dashbord = lazy(() => import("pages/Dashboard/Dashbord"));
const OrderDetails = lazy(() => import("pages/OrderDetails/OrderDetails"));
const Cart = lazy(() => import("pages/Cart/Cart"));
const PageNotFound = lazy(() => import("pages/PageNotFound/PageNotFound"));
const UserDetailWrapper = lazy(() =>
    import("pages/ProductDetails/ProductDetails")
);
const Checkout = lazy(() => import("pages/CheckOut/Checkout"));
const ForgotPassword = lazy(() =>
    import("pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("pages/ResetPassword/ResetPassword"));
const EmailVerificationWithParam = lazy(() =>
    import("pages/EmailVerification/EmailVerification")
);
const OrderSuccess = lazy(() => import("pages/OrderSuccess/OrderSuccess"));

class PageRouter extends PureComponent {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            userProfile: null,
            cartChecked: false,
            cartItems: null,
            cartCount: null,
            searchItems: "",
        };
    }

    productSearchManage = (key_words_obj) => {
        // setting the value to searchItem state
        this.setState({ searchItems: key_words_obj });
    };

    logInData = (data) => {
        const { email, password, currentUser } = data;
        this.setState({
            currentUser: currentUser,
            email: email,
            password: password,
        });
    };

    render() {
        return (
            <>
                <Header
                    productSearch={this.productSearchManage}
                    cartCount={this.state.cartCount}
                />

                <div className="main-container">
                    <Suspense fallback={"Loading....."}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        search_item={this.state.searchItems}
                                    />
                                }
                            />

                            <Route path="/:category/" element={<Products />} />

                            <Route
                                path="/:category/:slug/:color/:size/:id/"
                                element={<UserDetailWrapper />}
                            />

                            <Route
                                path="/user/registration/"
                                element={<Registration />}
                            />

                            <Route
                                path="/user/login/"
                                element={<Login login_data={this.logInData} />}
                            />

                            <Route
                                path="/user/:uidb64/email-verification/:token/"
                                element={<EmailVerificationWithParam />}
                            />

                            <Route
                                path="/user/forgot-password/"
                                element={<ForgotPassword />}
                            />

                            <Route
                                path="/user/reset-password/:userId/:token/"
                                element={<ResetPassword />}
                            />

                            <Route
                                path="/user/dashbord/:menu/"
                                element={<Dashbord />}
                            />

                            <Route path="/user/cart/" element={<Cart />} />

                            <Route
                                path="/user/dashbord/orders/:order_id/:orderId/"
                                element={<OrderDetails />}
                            />

                            <Route
                                path="/user/order/success/"
                                element={<OrderSuccess />}
                            />

                            <Route
                                path="/user/order/checkout/"
                                element={
                                    <Checkout userProfile={this.context} />
                                }
                            />

                            <Route path="/*" element={<PageNotFound />} />
                        </Routes>
                    </Suspense>
                </div>

                <Footer />
            </>
        );
    }
}

export default PageRouter;
