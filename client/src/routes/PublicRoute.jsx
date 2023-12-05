import { Navigate, Outlet} from 'react-router-dom';
import {store} from "../state/store"

const PublicRoute = () => {
    const token = store((state) => state.token)
    const role = store((state) => state.role)
    const isBlock = store((state) => state.isBlock)

    const isAuth = Boolean(token)
    const hasBlocked = Boolean(isBlock == 1)
    const isUser = Boolean(role == 1)
    const isAdmin = Boolean(role == 2)

    return ((isAuth && isUser && !hasBlocked) ? <Navigate to="/home" replace /> : (isAuth && isAdmin) ? <Navigate to="/admin" replace /> : <Outlet />)
}

export default PublicRoute