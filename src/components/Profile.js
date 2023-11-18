import { Component } from "react";
import './css/Profile.css';
import axios from "axios";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            profile:[],
            orderAddress:[]
        };
    }
    
    
    componentDidMount(){
        this.fetchOrderAddress();
    };




    fetchOrderAddress(){
        axios.get('http://127.0.0.1:8000/api/order-address/')
        .then((res) => {
            if (res.data[0]){

                this.setState({orderAddress:res.data});
                this.setState({profile:res.data[0].user})
            }
            
        }).catch((err) => {
            console.log(err);
        })
    }



    render() {
        const {profile, orderAddress} = this.state

        return (
            <div className="profile-main-container">

                <div className="profile-details-section">
           
                    {
                        profile.profile_image?
                        <div className="profile-pic">
                            <img src={profile.profile_image} />
                        </div>:null

                    }

                    <div className="profile-name-email"><br/><br/>
                        {
                            profile.first_name && profile.last_name ?
                            <h6>{`${profile.first_name} ${profile.last_name}`}</h6>
                            :profile.email&&<h6>{`${profile.email}`}</h6>
                        }

                    </div>

                    <div className="user-order-address"><br/><br/>
                    
                         {
                            orderAddress&&orderAddress.map((oa,index)=>(
                                <>
                                    <h5>Order Address</h5><br/>
                                    <div className="each-order-address">
                                        <h6>Address {index+1}</h6>
                                        <div>{oa.full_name}</div>
                                        <div>{oa.mobile}</div>
                                        <div>{oa.state}, {oa.city_district_town}, {oa.pincode}</div>
                                    </div>
                                </>
                            ))
                         }
                    </div>
                </div>

            </div>
        );
    }
}

export default Profile;