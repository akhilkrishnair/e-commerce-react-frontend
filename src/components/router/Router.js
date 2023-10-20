import { Component } from "react";
import axios from "axios";
import './Router.css'
import Header from "../Header";
import Footer from "../Footer";
import Products from "../Products";
import Product_Details from "../Product_Details";
import { Routes,Route } from "react-router";


class Router extends Component {
     
    constructor(props){
        super(props)
        this.state = {
            
        }
    }






    render() {
        return (
            <>
            <Header/>
                <div className="main-container">
                    <Routes>

                        <Route path="/" element={<Products/>}  />
                        <Route path="/:category/:slug/:color/:size/" element={<Product_Details />} /> 
                        
                    
                    </Routes>
                </div>
            <Footer/>
            </>
        );
    }
}

export default Router;