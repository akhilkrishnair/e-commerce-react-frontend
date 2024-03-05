import React, { Component } from "react";
import "./App.css";
import Router from "./components/router/Router";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";



export const access_token = localStorage.getItem('access_token')
export const baseUrl = "http://127.0.0.1:8000/api/"
export const webSocketUrl = `ws://127.0.0.1:8000/ws/order-updates/`

if (access_token){
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common.Authorization = "Bearer "+ access_token
}


class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Router />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
