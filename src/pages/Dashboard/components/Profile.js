import { PureComponent } from "react";
import './Profile.css';
import {axiosWithAuthentication, baseUrl} from "intersepter/axios";


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
        this.fetchProfile();
        this.fetchOrderAddress();
    };

    fetchProfile = () => {
        axiosWithAuthentication
        .get('user/profile/')
        .then((res) => {
            this.setState({profile:res.data})
        })
        .catch((err) => {})
    }

    fetchOrderAddress = () => {
        axiosWithAuthentication
        .get('order-address/')
        .then((res) => {
            if (res.data[0]){
                this.setState({orderAddress:res.data});
            }            
        })
        .catch((err) => {})
    }



    render() {
        const {profile, orderAddress} = this.state
        return (
            <div className="profile-main-container">

                <div className="profile-details-section">
           
                    {
                        profile?
                        <div className="profile-pic">
                            <img 
                                src={
                                    profile.profile_image[1]==="m"?
                                    baseUrl+profile.profile_image:
                                    profile.profile_image
                                } 
                                alt="user.jpg" 
                            />
                        </div>:null

                    }

                    <div className="profile-name-email"><br/><br/>
                        {
                            profile&&
                            <h6 key={'name'}>                                   
                                {`Hello ${profile.first_name} ${profile.last_name}`}
                            </h6>
                        }

                        {
                            profile&&
                            <h6 key={'e-mail'}>Email :                                    
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