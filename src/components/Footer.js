import { Component } from "react";

class Footer extends Component {
    
    render() {
        return (

            <footer className="bg-dark text-center text-white mt-5">
                <div className="container p-4 pb-0">
                    <section className="mb-4">
                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-facebook-f"></i></a>

                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-twitter"></i></a>

                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-google"></i></a>

                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-instagram"></i></a>

                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-linkedin"></i></a>

                    <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
                        ><i className="fab fa-github"></i></a>
                    </section>
                
                </div>
                

                
                <div className="text-center p-3" style={{backgroundColor : "rgba(0, 0, 0, 0.2)"}}>
                    © 2024 Copyright :
                    <span clpssName="text-white"> Eshop.com</span>
                </div>
            
            </footer>
            
        );
    }
}

export default Footer;