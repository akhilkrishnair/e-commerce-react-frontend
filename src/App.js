import React, { Component } from "react";
import "./App.css";
import Router from "./components/router/Router";
import { HashRouter } from "react-router-dom";
import axios from "axios";



export const access_token = localStorage.getItem('access_token')
export const baseUrl = "http://13.60.61.235/api/"
export const webSocketUrl = `ws://13.60.61.235/ws/order-updates/`

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
