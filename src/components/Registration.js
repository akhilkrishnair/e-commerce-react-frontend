import React, { Component } from "react";
import "./css/registration.css";
import axios from "axios";
import { Link } from "react-router-dom";

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
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const registrationData = {
            email:this.state.email,
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            password:this.state.password,
            password2:this.state.password2,
        };


        axios.post('http://127.0.0.1:8000/api/user/registration/',registrationData)
        .then((response) => {
            axios.post('http://127.0.0.1:8000/api/user/login/',{
                email:registrationData.email,
                password:registrationData.password,
            })
            .then((response) => {
                console.log(response);
                window.location.href = '/'
            }).catch((error)=>{
                console.log(error.response.data)
            })
                
        }).catch((error) => {
            console.log(error.response.data)
            if (error.response.data.email){
                this.setState({errorEmail:error.response.data})
                this.setState({errorPassword:null})
            }else if(error.response.data.non_field_errors){
                this.setState({errorPassword:error.response.data})
                this.setState({errorEmail:null})
            }
        })


    }

    render() {
        return (
            <>
                <section className="p-5 bg-image registration-background">
                    <div className="mask d-flex align-items-center h-25 gradient-custom-3 registration-container">
                        <div className="container h-100">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                                    <div className="card card-radius shadow">
                                        <div className="card-body p-5">
                                            <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                                            <form onSubmit={this.handleSubmit} >
                                                <div className="form-outline mb-3">
                                                    <label className="form-label" htmlFor="form3Example3cg">
                                                        Your Email 
                                                        <span className="text-danger ms-4" >
                                                            {
                                                                this.state.errorEmail?
                                                                "*"+ this.state.errorEmail.email:null
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
                                                    />
                                                </div>
                                                <span className="text-danger ms-4" >
                                                    {
                                                        this.state.errorPassword?
                                                        "*"+ this.state.errorPassword.non_field_errors:null
                                                    }
                                                 </span>



                                                <div className="form-check d-flex justify-content-center mb-2">
                                                    <input
                                                        className="form-check-input me-2"
                                                        type="checkbox"
                                                        value=""
                                                        id="form2Example3cg"
                                                    />
                                                    <label className="form-check-label" htmlFor="form2Example3g">
                                                        I agree all statements in{" "}
                                                        <a href="#!" className="text-body">
                                                            <u>Terms of service</u>
                                                        </a>
                                                    </label>
                                                </div>

                                                <div className="d-flex justify-content-center">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-block btn-sm gradient-custom-4 text-light"
                                                    >
                                                        Register
                                                    </button>
                                                </div>

                                                <p className="text-center text-muted mt-5 mb-0">
                                                    Have already an account?{" "}
                                                    <Link to={"/user/login/"} className="fw-bold text-body">
                                                        <u>Login here</u>
                                                    </Link>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
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
