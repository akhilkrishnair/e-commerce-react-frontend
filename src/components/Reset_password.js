import React, { PureComponent } from 'react'
import axios from 'axios';
import './css/Reset_password.css';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../App';



class ResetPassword extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            password:"",
            password2:"",
            loader:false
        }
    }


    handlePasswordChange = (event) => {
        const {value, name } = event.target
        this.setState({[name]:value})
    }

    passwordResetHandle = (e) => {
        e.preventDefault();
        this.setState({loader:true})

        if (this.state.password === this.state.password2){
            const data = {
                user_id:this.props.user_id,
                token:this.props.token,
                password:this.state.password
            }
     
             axios.
             post(baseUrl+"user/password-reset/",
             data)
            .then((res) => {

                console.log(res)
                localStorage.setItem("refresh_token", res.data.refresh)
                localStorage.setItem("access_token", res.data.access)
                window.location.href = "/"

             }).catch((error)=>{
                 console.log(error)
             }).then(()=>{
                this.setState({loader:false})
             })
        }else{
            console.log("password and confirm password does not match")
            this.setState({loader:false})
        }
    }


    render(){

        return(
            <form className='reset-password-container' onSubmit={this.passwordResetHandle}>
                <h5>Reset your password</h5><br/><br/>
                <div className='password'>
                    <input 
                    onChange={this.handlePasswordChange}
                    className='form-control' 
                    type='password'
                    name='password' 
                    placeholder='password'
                    minLength={8}
                    required/>                    
                </div>
                <div className='password'>
                    <input 
                    onChange={this.handlePasswordChange}
                    className='form-control' 
                    type='password' 
                    name='password2'
                    placeholder='confirm password'
                    minLength={8}
                    required/>                    
                </div>


                <div className='submit'>
                {
                    !this.state.loader?
                        <button 
                            className='password-reset-submit-btn'
                            type='submit'>
                            Change password
                        </button>                   
                    :
                    <div 
                        className='password-reset-submit-btn'>
                        <div class="loader"></div>  
                    </div>
                }
                </div>


            </form>
        )
    }
}


const ResetPasswordWithParams = ()=> {
    const {userId,token} = useParams();
    return < ResetPassword user_id={userId} token={token} />
}

export default ResetPasswordWithParams;
