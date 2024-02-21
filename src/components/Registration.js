import React, { Component } from "react";
import './css/Registration.css';
import axios from "axios";
import { Link } from "react-router-dom";
import { baseUrl } from "../App";




class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            password2:"",
            errorEmail:null,
            errorPassword:null,
            loading:false,
            registration:false
        };
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const registrationData = {
            email:this.state.email,
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            password:this.state.password,
            password2:this.state.password2,
        };
        
        this.setState({errorEmail:null})
        this.setState({errorPassword:null})
        this.setState({loading:true})

        try{
            const response = await axios.post(baseUrl+'user/registration/',
            registrationData)
            this.setState({registration:true})                    

        } catch (error){
            console.log(error)
            if (error.response.data.non_field_errors){
                this.setState({errorPassword:error.response.data.non_field_errors[0]})
            }else{
                this.setState({errorEmail:error.response.data.email[0]})
            }
        }finally{
            this.setState({loading:null})
        }

    }

    render() {
        return (
            <>
                <section className="p-5 bg-image registration-background">
                    <div className="mask d-flex align-items-center h-25 gradient-custom-3 registration-container">
                        <div className="container h-100">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                
                                <div className="col-12 col-md-9 col-lg-7 col-xl-6">

                                    {
                                        this.state.registration?
                                        <h5>A link has been send to your {this.state.email} account go and verify </h5>
                                         :
                                        <div className="card card-radius shadow">                                                                          
                                            <div className="card-body p-5">
                                                <h4 className="text-uppercase text-center mb-5">Create an account</h4>

                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-outline mb-3">
                                                        <label className="form-label" htmlFor="form3Example3cg">
                                                            Your Email 
                                                            <span className="text-danger ms-4" >
                                                                {
                                                                    this.state.errorEmail?
                                                                    "*"+ this.state.errorEmail:null
                                                                }
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="form3Example3cg"
                                                            value={this.state.email}
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-outline mb-3">
                                                        <label className="form-label" htmlFor="form3Example1cg">
                                                            First Name 
                                                        </label>
                                                        <input
                                                            name="first_name"
                                                            type="text"
                                                            id="form3Example1cg"
                                                            value={this.state.first_name}
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-outline mb-3">
                                                        <label className="form-label" htmlFor="form3Example4cg">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            name="last_name"
                                                            type="text"
                                                            id="form3Example4cg"
                                                            value={this.state.last_name}
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-outline mb-3">
                                                        <label className="form-label" htmlFor="form3Example4cdg">
                                                            your password
                                                        </label>
                                                        <input
                                                            name="password"
                                                            type="password"
                                                            id="form3Example4cdg"
                                                            value={this.state.password}
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-3">
                                                        <label className="form-label" htmlFor="form3Example6cdg">
                                                            confirm password

                                                        </label>
                                                        <input
                                                            name="password2"
                                                            type="password"
                                                            id="form3Example6cdg"
                                                            value={this.state.password2}
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <span className="text-danger ms-4" >
                                                        {
                                                            this.state.errorPassword?
                                                            "*"+ this.state.errorPassword:null
                                                        }
                                                    </span>


                                                    
                                                        
                                                            { 
                                                                !this.state.loading?
                                                                <button className="register-submit-btn d-flex justify-content-center mt-2" type="submit">
                                                                    Register
                                                                </button>
                                                                    
                                                                :
                                                                <div className="register-submit-btn d-flex justify-content-center mt-2">
                                                                    <div class="loader"></div>
                                                                </div>
                                                            }
                                 

                                                    {/* {
                                                        this.state.loading&&
                                                        <div className="d-flex justify-content-center mt-4">

                                                                <div class="loader"></div>
                                                           
                                                        </div>                                                    
                                                    } */}

                                                    <p className="text-center text-muted mt-4 mb-0">
                                                        Have already an account?{" "}
                                                        <Link to={"/user/login/"} className="fw-bold text-body">
                                                            <u>Login here</u>
                                                        </Link>
                                                    </p>
                                                </form>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default Registration;
