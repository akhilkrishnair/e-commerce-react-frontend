import { Navigate } from "react-router"


const withoutAuthentication = (WrappedComponent) => {
    return (props)  => {
        
        const accessToken = localStorage.getItem('access_token')

        if (!accessToken){
            return <WrappedComponent {...props} />
        }
        return <Navigate to={'/'} />
    }
}

export default withoutAuthentication;