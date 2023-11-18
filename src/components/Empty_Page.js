import { Component } from "react";


class Empty_Page extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div className="empty-page">
                <p className="text-center my-5" >Page not found</p>
            </div>
        );
    }
}

export default Empty_Page;