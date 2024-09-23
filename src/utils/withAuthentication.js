import { Navigate } from "react-router"


const withAuthentication = (WrappedComponent) => {
    return (props)  => {
        
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken){
            return <WrappedComponent {...props} />
        }
        return <Navigate to={'/'} />
    }
}

export default withAuthentication;