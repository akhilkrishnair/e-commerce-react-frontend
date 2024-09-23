import React,{ Component } from "react";
import { NavLink, useParams} from "react-router-dom";
import Wishlist from "./components/Wishlist";
import './Dashbord.css';
import Orders from "pages/Orders/Orders";
import Profile from "./components/Profile";
import { useNavigate } from "react-router-dom";
import {axiosWithAuthentication} from "intersepter/axios";
import withAuthentication from "utils/withAuthentication";


class Dashbord extends Component {
    constructor(props) {
        super(props);
        this.state={
            currentUser:false,
            loading:false
        }
    }


    logOutReq = ()=>{
        this.setState({loading:true})        
        axiosWithAuthentication
        .post('user/logout/',
        {refresh_token:localStorage.getItem('refresh_token')}
        )
        .then((res) => {
            this.setState({currentUser:false})
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            window.location.href = '/'
        }).catch((res) =>{
           this.setState({loading:false})
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
                        Orders
                    </NavLink>
                    <hr/>

                    {
                        !this.state.loading?
                        <div
                            onClick={this.logOutReq}  
                            className="dashbord-link" >
                            Logout
                        </div>:
                        <div 
                            className="dashbord-link loader-container" >
                            <div className="loader"></div>                            
                        </div>
                    }

                </div>

                <div className="section-details-view">
                            
                    {
                        menu==='profile'&&
                        <div hidden={false} className='menu-component Profile' value='Profile'>
                            <Profile />
                        </div>
                    }  

                    {
                        menu==='wishlist'&&
                        <div hidden={false}  className='menu-component Wishlist' value='Wishlist'>
                            <Wishlist />
                        </div>
                    } 

                    {
                        menu==='orders'&&
                        <div hidden={false} className='menu-component Orders' value='Orders'>
                            <Orders />
                        </div>
                    } 
                    
                </div>
            </div>
        );
    }
}

 function DashbordWithNavigation() {
    const navigate = useNavigate();
    const dash_param = useParams();
    return (<Dashbord navigate={navigate} dash_param={dash_param} />);
}

export default withAuthentication(DashbordWithNavigation)

