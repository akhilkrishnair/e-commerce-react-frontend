import React, { Component } from "react";
import axios from "axios";
import "./Router.css";
import Header from "../Header";
import Footer from "../Footer";
import Products from "../Products";
import Product_Details from "../Product_Details";
import Registration from "../Registration";
import Login from "../Login";
import { Routes, Route } from "react-router-dom";
import Dashbord from "../Dashbord";
import Order_Details from "../Order_Details";
import Cart from "../Cart";
import Empty_Page from "../Empty_Page";



class Router extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            email: "",
            password: "",
        };
    }

    logInData = (data) => {
        const { email, password, currentUser } = data;
        console.log("Router ", currentUser);
        this.setState({ currentUser: currentUser });
        this.setState({ email: email });
        this.setState({ password: password });
    };

    componentDidMount() {
        axios
            .get("http://127.0.0.1:8000/api/user/profile/")
            .then((res) => {
                this.setState({ currentUser: true });
            })
            .catch((res) => {
                console.log(res);
                this.setState({ currentUser: false });
            });
    }

    render() {
        return (
            <>
                <Header current_user={this.state.currentUser} />
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/:category/" element={<Products />} />
                        <Route path="/user/registration/" element={<Registration />} />


                        {!this.state.currentUser&&
                            <Route
                                path="/user/login/"
                                element={<Login current_user={this.state.currentUser} login_data={this.logInData} />}
                            />
                        }
                        {   
                            this.state.currentUser&&
                            <Route path="/user/dashbord/" element={<Dashbord/>} />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/dashbord/:menu/" element={<Dashbord/>} />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/cart/" element={<Cart/>} />
                        }
                        {
                            this.state.currentUser&&
                            <Route path="/user/dashbord/orders/:order_id/" element={<Order_Details/>} />
                        }

                        <Route path="/:category/:slug/:color/:size/" element={<Product_Details current_user={this.state.currentUser} />} />
                        <Route path="/*" element={<Empty_Page/>} />
                    </Routes>
                </div>
                <Footer />
            </>
        );
    }
}

export default Router;
