import { Navigate, Outlet} from 'react-router-dom';
import {store} from "../state/store"

const AdminRoutes = () => {
    const token = store((state) => state.token)
    const role = store((state) => state.role)
    const isAuth = Boolean(token)
    const isAdmin = Boolean(role == 2)

    return ((isAuth && isAdmin) ? <Outlet /> : <Navigate to="/" replace />)
}

export default AdminRoutes