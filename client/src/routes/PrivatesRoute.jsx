import { Navigate, Outlet} from 'react-router-dom';
import {store} from "../state/store"

const PrivateRoutes = () => {
    const token = store((state) => state.token)
    const role = store((state) => state.role)
    const isBlock = store((state) => state.isBlock)

    const hasBlocked = Boolean(isBlock == 1)
    const isAuth = Boolean(token)
    const isUser = Boolean(role == 1)

    return ((isAuth && isUser && !hasBlocked) ? <Outlet /> : <Navigate to="/" replace />)
}

export default PrivateRoutes