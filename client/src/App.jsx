import * as React from 'react';
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginRegisterPage from "./view/LoginRegisterPage"
import HomePage from './view/HomePage';
import ProfilePage from './view/ProfilePage';
import FriendPage from './view/FriendPage';
import PrivateRoutes from './routes/PrivatesRoute';
import { store } from './state/store';
import SocketClient from '../SocketClient';
import PublicRoute from './routes/PublicRoute';
import NotificationPage from './view/NotificationPage';
import PostSavedPage from './view/PostSavedPage';
import PostDetail from './components/PostDetail';
import AdminPage from './view/AdminPage';
import AdminRoutes from './routes/AdminRoutes';
import UserManage from './view/AdminPage/UserManage';
import PostManage from './view/AdminPage/PostManage';


function App() {
    const token = store((state) => state.token)
    const isAuth = Boolean(token)
    return (
        <div className="app">
            {isAuth && <SocketClient />}
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="/" element={<LoginRegisterPage />} />
                    </Route>
                    <Route element={<PrivateRoutes />} >
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile/:userID" element={<ProfilePage />} />
                        <Route path="/friend" element={<FriendPage />} />
                        <Route path="/notifications" element={<NotificationPage />} />
                        <Route path="/bookmark" element={<PostSavedPage />} />
                        <Route path="/post/:postID" element={<PostDetail />} />
                    </Route>
                    <Route element={<AdminRoutes />}>
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/UserManage" element={<UserManage />} />
                        <Route path="/PostManage" element={<PostManage />} />
                    </Route>
                </Routes>        
            </BrowserRouter>
        </div>
    );
}

export default App
