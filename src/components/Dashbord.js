import axios from "axios";
import React,{ Component } from "react";
import { NavLink } from "react-router-dom";
import Wishlist from "./Wishlist";
import './css/Dashbord.css';


class Dashbord extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        };
    }






    render() {
        return (
            <div className="dashbord-main-container">
                <div className="profile-menu-section">
                    <NavLink className="dashbord-link" >
                        Profile
                    </NavLink >

                    <NavLink className="dashbord-link" >
                        Wishlist
                    </NavLink>

                    <NavLink className="dashbord-link" >
                        Order
                    </NavLink>

                    <NavLink className="dashbord-link" >
                        Logout
                    </NavLink>

                </div>

                <div className="section-details-view">
                     <Wishlist />
                </div>
            </div>
        );
    }
}

export default Dashbord;