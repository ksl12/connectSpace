import {create} from "zustand"
import {persist, createJSONStorage} from "zustand/middleware"


let storeUser = (set) => ({
    mode: "light",
    user: {},
    role: 0,
    isBlock: null,
    token: "",
    socket: null,
    notification: [],
    notiRead: [],
    notificationAll: [],
    notiReadAll: [],
    postSaved: [],
    setNotification: (notification) => set(() => ({notification: notification})),
    setNotiRead: (notiRead) => set(() => ({notiRead: notiRead})),
    setNotificationAll: (notificationAll) => set(() => ({notificationAll: notificationAll})),
    setNotiReadAll: (notiReadAll) => set(() => ({notiReadAll: notiReadAll})),
    setPostSaved: (postSaved) => set(() => ({postSaved: postSaved})),
    setSocket: (socket) => set(() => ({socket: socket})),
    setToken: (newuser, newtoken) => set(() => ({user: newuser, token: newtoken})),
    setBlock: (isBlock) => set(() => ({isBlock: isBlock})),
    setRole: (role) => set(() => ({role: role})),
    clearSession: () => {
        set(() => ({user: {}, token: "", role: 0}))
        localStorage.removeItem("auth")
    }
})

storeUser = persist(storeUser, {
    name: "auth", 
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ mode: state.mode, user: state.user, role: state.role, token: state.token, isBlock: state.isBlock}) 
});

export const store = create(storeUser)

        