import { PureComponent } from "react";
import './css/Profile.css';
import axios from "axios";
import { access_token, baseUrl } from "../App";

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            profile:null,
            orderAddress:[]
        };
    }
    
    componentWillUnmount(prevProps,prevState){
         if (prevState !== this.state){
            this.fetchProfile();
            this.fetchOrderAddress();
         }
    }
    componentDidMount(){
        if(access_token){
            this.fetchProfile();
            this.fetchOrderAddress();
        }
    };


    fetchProfile = () => {
        axios.get(baseUrl+'user/profile/')
        .then((res) => {
            this.setState({profile:res.data})
            console.log(res)
        }).catch((err) => {
            console.log(err);
        })
    }

    fetchOrderAddress = () => {
        axios.get(baseUrl+'order-address/')
        .then((res) => {
            if (res.data[0]){
                this.setState({orderAddress:res.data});
            }
            console.log(res)
            
        }).catch((err) => {
            console.log(err);
        })
    }



    render() {
        const {profile, orderAddress} = this.state
        console.log(this.state)
        return (
            <div className="profile-main-container">

                <div className="profile-details-section">
           
                    {
                        profile?
                        <div className="profile-pic">
                            <img src={profile.profile_image[1]==="m"?
                                "http://127.0.0.1:8000"+profile.profile_image:
                                profile.profile_image
                            
                            }  />
                        </div>:null

                    }

                    <div className="profile-name-email"><br/><br/>
                        {
                            profile&&
                            <h6>                                   
                                {`Hello ${profile.first_name} ${profile.last_name}`}
                            </h6>
                        }

                        {
                            profile&&
                            <h6>Email :                                    
                                {profile.email}
                            </h6>
                        }

                    </div>

                    <div className="user-order-address"><br/><br/>
                    
                    <h5>Order Address</h5>
                         {
                            orderAddress&&orderAddress.map((oa,index)=>(
                                <>
                                    <div className="each-order-address">
                                        <h6>Address {index+1}</h6>
                                        <div>{oa.full_name}</div>
                                        <div>{oa.mobile}</div>
                                        <div>{oa.state}, {oa.city_district_town}, {oa.pincode}</div>
                                    </div><br/>
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