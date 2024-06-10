import React, { Component } from "react";
import "./App.css";
import Router from "./components/router/Router";
import { HashRouter } from "react-router-dom";
import axios from "axios";



export const access_token = localStorage.getItem('access_token')
export const baseUrl =  "http://127.0.0.1:8000/api/"
// "https://akhilkrishna.pythonanywhere.com/api/" 
export const webSocketUrl = `ws://akhilkrishna.pythonanywhere.com/ws/order-updates/`

if (access_token){
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.Authorization = "Bearer "+ access_token
}


class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className="App">
                    <Router />
                </div>
            </HashRouter>
        );
    }
}

export default App;
