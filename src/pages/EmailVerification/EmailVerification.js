import React, { PureComponent } from 'react'
import 'pages/ForgotPassword/ForgotPassword.css';
import { useParams } from 'react-router-dom';
import { axiosWithoutAuthentication } from 'intersepter/axios';
import withoutAuthentication from 'utils/withoutAuthentication';


class EmailVerification extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            emailVerified:false,
            loading:false,
        }
    }  

    componentDidMount(){
        this.verifyEmail();
    }

    verifyEmail = () => {

        this.setState({loading:true});

        const {uidb64, token} = this.props
        
        axiosWithoutAuthentication
        .get(`user/activate-email/${uidb64}/${token}/`)
        .then((response) => {
            this.setState({emailVerified:true})

            if (response.status === 200){

                localStorage.setItem('refresh_token', response.data.refresh)
                localStorage.setItem('access_token', response.data.access)
                window.location.href = '/'
            }

        }).catch((err) => {
            this.setState({emailVerified:false});
        }).then(()=>{
            this.setState({loading:false});        
        })

    }


    render(){

        const {emailVerified,loading} = this.state

        return(             
            <div className='forgot-password-container'>
                <h4>{loading&&"Email verifying ..."}</h4>
                <h6>
                    {emailVerified&&"Your email successfully verified"}
                    {!emailVerified&&"Verification link invalid"}
                </h6>
            </div>
        )
    }
}


const EmailVerificationWithParam = () => {
    const {uidb64,token} = useParams();
    return <EmailVerification uidb64={uidb64} token={token} />
}

export default withoutAuthentication(EmailVerificationWithParam);