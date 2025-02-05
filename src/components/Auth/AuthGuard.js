import { PureComponent } from "react";
import { checkToken } from "utils/checkToken";
import "./AuthGuard.css";

export default class AuthGuard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            authChecked: false,
        };
    }
    async componentDidMount() {
        await checkToken();
        setTimeout(() => {
            this.setState({ authChecked: true });
        }, 1000);
    }
    render() {
        if (this.state.authChecked) return this.props.children;
        return (
            <div className="auth-guard-loader-container">
                <div className="auth-guard-loader"></div>
                <h5>Loading</h5>
            </div>
        );
    }
}
