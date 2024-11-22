import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import withoutAuthentication from "utils/withoutAuthentication";
import { handleUserLogin } from "api/user";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            email: "",
            password: "",
            error: null,
            loader: false,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleChange = (e) => {
        this.setState({ error: null });
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (e) => {
        this.setState({ loader: true });
        e.preventDefault();

        const LoginData = {
            email: this.state.email,
            password: this.state.password,
        };

        handleUserLogin(LoginData)
            .then((response) => {
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                window.location.href = "/";
            })
            .catch((error) => {
                this.setState({ error: error.response.data });
                this.setState({ loader: false });
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
                                        <h3 className="mb-4">Log In</h3>
                                        {
                                            <p className="text-danger ">
                                                {" "}
                                                &nbsp;
                                                {this.state.error &&
                                                    `* ${this.state.error.message}`}
                                            </p>
                                        }

                                        <div className="form-outline mb-2">
                                            <label
                                                className="form-label"
                                                htmlFor="typeEmailX-2"
                                            >
                                                Email
                                            </label>
                                            <input
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                type="email"
                                                id="typeEmailX-2"
                                                className="form-control form-control-sm"
                                                required
                                            />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label
                                                className="form-label"
                                                htmlFor="typePasswordX-2"
                                            >
                                                Password
                                            </label>{" "}
                                            <br />
                                            <input
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                type="password"
                                                id="typePasswordX-2"
                                                className="form-control form-control-sm"
                                                required
                                            />
                                            <br />
                                            <Link
                                                className="forgot-password"
                                                to={`/user/forgot-password/`}
                                            >
                                                forgot password?
                                            </Link>
                                        </div>

                                        {!this.state.loader ? (
                                            <button
                                                className="login-submit-btn "
                                                type="submit"
                                            >
                                                Login
                                            </button>
                                        ) : (
                                            <div className="login-submit-btn">
                                                <div className="loader"></div>
                                            </div>
                                        )}

                                        <p className="text-center text-muted mt-4">
                                            New User?{" "}
                                            <Link
                                                to={"/user/registration/"}
                                                className="fw-bold text-body"
                                            >
                                                <u>register here</u>
                                            </Link>
                                        </p>
                                        <hr className="mt-5" />
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

export default withoutAuthentication(Login);
