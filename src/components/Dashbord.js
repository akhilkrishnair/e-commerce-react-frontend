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

    
    menuCompFun(e){
        const menuCom = document.getElementsByClassName('menu-component')
        for(let mc=0; mc<menuCom.length; mc++){
            if (menuCom[mc].classList[1] === `${e}`){
                menuCom[mc].hidden = false
            }else{
                menuCom[mc].hidden = true
            }
        }
    }


    render() {
       
        const elem = document.getElementsByClassName('menu-component')
        if(window.location.pathname == '/user/dashbord/wishlist/' ){
           this.menuCompFun("Wishlist")
        }

        if(window.location.pathname == '/user/dashbord/orders/' ){
            this.menuCompFun("Orders")
        }

        if(window.location.pathname == '/user/dashbord/profile/' ){
            this.menuCompFun("Profile")
        }

        const {menu} = this.props.dash_param
        console.log(menu)


        return (
            <div className="dashbord-main-container">
                <div className="profile-menu-section">

                    <NavLink
                    to={'/user/dashbord/profile/'}
                    onClick={()=>this.menuCompFun("Profile")} 
                    className="dashbord-link" >
                        Profile
                    </NavLink >

                    <NavLink 
                    onClick={()=>this.menuCompFun("Wishlist")} 
                    to={'/user/dashbord/wishlist/'} 
                    className="dashbord-link" >
                        Wishlist
                    </NavLink>

                    <NavLink 
                    onClick={()=>this.menuCompFun("Orders")} 
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
    useNavigate();
    const dash_param = useParams();
    return <Dashbord dash_param={dash_param} />;
}

