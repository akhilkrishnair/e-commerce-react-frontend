import { PureComponent } from "react";
import './PageNotFound.css';
import { FaQuestionCircle } from "react-icons/fa";


class Empty_Page extends PureComponent {
    render() {
        return (
            <div className="empty-page-container">
                <FaQuestionCircle />
                <h2>Page not found</h2>
                <p>You requested page was not found! <br/>please check address and retry.</p>
            </div>
        );
    }
}

export default Empty_Page;