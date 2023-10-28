import React,{ Component } from "react";
import { NavLink} from "react-router-dom";
import axios from "axios";
import Wishlist from "./Wishlist";
import './css/Dashbord.css';
import Orders from "./Orders";
import Profile from "./Profile";


class Dashbord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuComponent:[]
        };
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
        if(window.location.pathname === '/user/dashbord/wishlist/' && document.getElementsByClassName('menu-component')[1]){
           elem[1].hidden = false
        }

        if(window.location.pathname === '/user/dashbord/orders/' && document.getElementsByClassName('menu-component')[2]){
            elem[2].hidden = false
        }

        if(window.location.pathname === '/user/dashbord/profile/' && document.getElementsByClassName('menu-component')[0]){
            elem[0].hidden = false
        }


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

                    <div
                    onClick={this.logOutReq}  
                    className="dashbord-link" >
                        Logout
                    </div>

                </div>

                <div className="section-details-view">
                    {
                        <>  
                           <div hidden={false} className='menu-component Profile' value='Profile'>
                                <Profile />
                           </div>

                           <div hidden={true}  className='menu-component Wishlist' value='Wishlist'>
                                <Wishlist />
                           </div>

                           <div hidden={true} className='menu-component Orders' value='Orders'>
                                <Orders />
                           </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default Dashbord;
