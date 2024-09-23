import { Navigate } from "react-router"


const withoutAuthentication = (WrappedComponent) => {
    return (props)  => {
        
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken){
            return <WrappedComponent {...props} />
        }
        return <Navigate to={'/'} />
    }
}

export default withoutAuthentication;