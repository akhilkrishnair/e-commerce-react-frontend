import React,{ Component } from "react";
import { NavLink, useParams} from "react-router-dom";
import axios from "axios";
import Wishlist from "./Wishlist";
import './css/Dashbord.css';
import Orders from "./Orders";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";


class Dashbord extends Component {
    constructor(props) {
        super(props);
        this.state={
            currentUser:false,
        }
    }


    logOutReq = ()=>{
        axios.get('http://127.0.0.1:8000/api/user/logout/')
        .then((res) => {
            this.setState({currentUser:false})
            window.location.href = '/'
        }).catch((res) =>{
           console.log(res)
        });
    }



    render() {
       

        const {menu} = this.props.dash_param
 


        return (
            <div className="dashbord-main-container">
                <div className="profile-menu-section">

                    <NavLink
                    to={'/user/dashbord/profile/'}
                    className="dashbord-link" >
                        Profile
                    </NavLink >

                    <NavLink 
                    to={'/user/dashbord/wishlist/'} 
                    className="dashbord-link" >
                        Wishlist
                    </NavLink>

                    <NavLink 
                    to={'/user/dashbord/orders/'} 
                    className="dashbord-link" >
                        Order
                    </NavLink>
                    <hr/>
                    <div
                    onClick={this.logOutReq}  
                    className="dashbord-link" >
                        Logout
                    </div>

                </div>

                <div className="section-details-view">
                            
                    {
                    menu=='profile'&&
                        <div hidden={false} className='menu-component Profile' value='Profile'>
                            <Profile />
                        </div>

                    }  

                    {
                    menu=='wishlist'&&
                        <div hidden={false}  className='menu-component Wishlist' value='Wishlist'>
                            <Wishlist />
                        </div>

                    } 

                    {
                    menu=='orders'&&
                        <div hidden={false} className='menu-component Orders' value='Orders'>
                            <Orders />
                        </div>
                    } 
                </div>
            </div>
        );
    }
}

export default function DashbordWithNavigation() {
    const navigate = useNavigate();
    const dash_param = useParams();
    return <Dashbord navigate={navigate} dash_param={dash_param} />;
}

