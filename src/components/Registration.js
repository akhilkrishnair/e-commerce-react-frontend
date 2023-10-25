import React, { Component } from "react";
import "./css/registration.css";
import axios from "axios";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
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
        };


        axios.post('http://127.0.0.1:8000/api/user/registration/',registrationData)
        .then((response) => {
            console.log(response.data)
            window.location="/"
        }).catch((error) => {
            console.log(error)
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
                                                <div className="form-outline mb-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="form3Example3cg"
                                                        value={this.state.email}
                                                        onChange={this.handleChange}
                                                        className="form-control form-control-sm"
                                                    />
                                                    <label className="form-label" htmlFor="form3Example3cg">
                                                        Your Email
                                                    </label>
                                                </div>

                                                <div className="form-outline mb-2">
                                                    <input
                                                        name="first_name"
                                                        type="text"
                                                        id="form3Example1cg"
                                                        value={this.state.first_name}
                                                        onChange={this.handleChange}
                                                        className="form-control form-control-sm"
                                                    />
                                                    <label className="form-label" htmlFor="form3Example1cg">
                                                        First Name
                                                    </label>
                                                </div>

                                                <div className="form-outline mb-2">
                                                    <input
                                                        name="last_name"
                                                        type="text"
                                                        id="form3Example4cg"
                                                        value={this.state.last_name}
                                                        onChange={this.handleChange}
                                                        className="form-control form-control-sm"
                                                    />
                                                    <label className="form-label" htmlFor="form3Example4cg">
                                                        Last Name
                                                    </label>
                                                </div>

                                                <div className="form-outline mb-2">
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        id="form3Example4cdg"
                                                        value={this.state.password}
                                                        onChange={this.handleChange}
                                                        className="form-control form-control-sm"
                                                    />
                                                    <label className="form-label" htmlFor="form3Example4cdg">
                                                        your password
                                                    </label>
                                                </div>

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
                                                    <a href="#!" className="fw-bold text-body">
                                                        <u>Login here</u>
                                                    </a>
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
