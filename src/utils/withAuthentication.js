import { Navigate } from "react-router"


const withAuthentication = (WrappedComponent) => {
    return (props)  => {
        
        const accessToken = localStorage.getItem('access_token')

        if (accessToken){
            return <WrappedComponent {...props} />
        }
        return <Navigate to={'/'} />
    }
}

export default withAuthentication;