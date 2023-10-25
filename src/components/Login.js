import axios from "axios";
import React, { Component } from "react";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentUser:false,
            email:"",
            password:"",
         };
    }
    




    handleChange = (e) => {
        const {name,value} = e.target
        this.setState({[name]:value})
    };
    
    handleSubmit = (e) => {

        e.preventDefault();
        const LoginData = {
            email:this.state.email,
            password:this.state.password,
        };

        axios.post('http://127.0.0.1:8000/api/user/login/',LoginData)
        .then((response) => {
            console.log(response);
            this.setState({currentUser:true});
            console.log("then function ",this.state.currentUser); 
            this.props.login_data(this.state);
            window.location.href = '/'
        })
        .catch((error) => {
            console.log(error)
        })
    };
    

    render() {
        
        return (
           <>  

                <section className="" >
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" >
                        <form className="card-body p-5 text-center login-form" onSubmit={this.handleSubmit} >

                            <h3 className="mb-5">Sign in</h3>

                            <div className="form-outline mb-2">
                            <input name="email" value={this.state.email} onChange={this.handleChange} type="email" id="typeEmailX-2" className="form-control form-control-sm" />
                            <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                            </div>

                            <div className="form-outline mb-2">
                            <input name="password" value={this.state.password} onChange={this.handleChange} type="password" id="typePasswordX-2" className="form-control form-control-sm"  />
                            <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                            </div>

                            
                            <div className="form-check d-flex justify-content-start mb-4">
                            <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                            <label className="form-check-label" htmlFor="form1Example3"> Remember password </label>
                            </div>

                            <button className="btn btn-primary btn-md btn-block" type="submit">Login</button>

                            <hr className="my-4"/>


                        </form>
                        </div>
                    </div>
                    </div>
                </div>
                </section>


           </> 
        );
    }
}

export default Login;