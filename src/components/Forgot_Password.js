import React, { PureComponent } from 'react'
import axios from 'axios';
import './css/Forgot_password.css';
import { baseUrl } from '../App';

class ForgotPassword extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            email:"",
            linkSend:false,
            errors:null,
            emailError:null,
            loading:false

        }
    }  

    onChangeEmail = (event) => {
        const {value} = event.target
        this.setState({email:value})
    }

    resetErrorMsg = () => {
        this.setState({errors:null})
        this.setState({emailError:null})
    }

    passwordForgotHandle = () => {

        this.setState({loading:true})
        
        const data = {email:this.state.email }
        axios.
        post(baseUrl+"user/password-forgot/",
        data).then((res) => {
            this.setState({linkSend:true})      
        }).catch((error)=>{
            if (error.response.data.error){
                this.setState({errors:error.response.data.error})
            }
            if (error.response.data.email){
                this.setState({emailError:error.response.data.email[0]})
            }
        }).then(() => {
            this.setState({loading:false})
        })
    }


    render(){

        const {errors,email,linkSend,emailError,loading} = this.state
        return(
             
            <div className='forgot-password-container'>
                {
                    linkSend&&
                    <p>password reset link has been send to {email} go and check</p>
                }
                {
                    !linkSend&&
                    <>
                        <h4>Forgot password ?</h4>
                        <div>
                            <p> Please enter your email address we will send a link for resetting your password</p>
                            <input 
                            onChange={this.onChangeEmail} 
                            onClick={this.resetErrorMsg}
                            name='email'
                            value={email}
                            className='form-control' 
                            type='email' 
                            placeholder='Enter your email' 
                            required />

                            {
                                loading?
                                <div class="loader"></div>
                                :
                                <button 
                                    className='btn btn-success'
                                    onClick={this.passwordForgotHandle}>
                                    reset password
                                </button>
                            }
                        </div>
                        <p className='error'>{errors?"* "+errors:emailError&&"* "+emailError}</p>
                    </>                
                }
            </div>
        )
    }
}

export default ForgotPassword;