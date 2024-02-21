import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import './css/Login.css'
import { baseUrl } from "../App";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            email: "",
            password: "",
            error: null,
            loader:false
        };
    }

    handleChange = (e) => {
        this.setState({error:null})
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (e) => {
        this.setState({loader:true})
        e.preventDefault();
        const LoginData = {
            email: this.state.email,
            password: this.state.password,
        };

        axios
            .post(baseUrl+"user/login/token/", 
            LoginData)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ currentUser: true });
                    localStorage.setItem("access_token", response.data.access);
                    localStorage.setItem(
                        "refresh_token",
                        response.data.refresh
                    );
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
                    this.props.login_data(this.state);
                    window.location.href = "/";
                    return response;
                }
                this.setState({ error: response.response.data });
                return response;
            })
            .catch((error) => {
                console.log(error)
                this.setState({ currentUser: false });
                this.setState({ error: error.response.data });
                this.setState({loader:false})
            }).then(()=>{
            });
    };

    render() {
        return (
            <>
                <section className="">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card shadow-2-strong">
                                    <form
                                        className="card-body p-5 text-center login-form"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <h3 className="mb-4">Sign in</h3>
                                        {
                                            <p className="text-danger ">
                                                {" "}
                                                &nbsp;
                                                {this.state.error &&
                                                    `* ${this.state.error.message}`}
                                            </p>
                                        }

                                        <div className="form-outline mb-2">
                                            <input
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                type="email"
                                                id="typeEmailX-2"
                                                className="form-control form-control-sm"
                                                required
                                            />
                                            <label
                                                className="form-label"
                                                htmlFor="typeEmailX-2"
                                            >
                                                Email
                                            </label>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                type="password"
                                                id="typePasswordX-2"
                                                className="form-control form-control-sm"
                                                required
                                            />
                                            <label
                                                className="form-label"
                                                htmlFor="typePasswordX-2"
                                            >
                                                Password
                                            </label>{" "}
                                            <br />
                                            <Link 
                                            className="forgot-password"
                                            to={`/user/forgot-password/`}>
                                                forgot password?
                                            </Link>
                                        </div>
                                        
                                        
                                        {
                                            !this.state.loader?
                                            <button
                                                className="login-submit-btn "
                                                type="submit"
                                            >
                                                Login
                                            </button>:
                                            <div className="login-submit-btn" >
                                                <div class="loader"></div>
                                            </div>
                                        }
                                       

                                        <hr className="my-5" />
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
