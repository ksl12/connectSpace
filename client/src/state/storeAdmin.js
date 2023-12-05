import {create} from "zustand"


let storeAdmin = (set) => ({
    adminSocket: null,
    totalActiveUser: 0,
    setTotalActiveUser: (totalActiveUser) => set(() => ({totalActiveUser: totalActiveUser})),
    setAdminSocket: (adminSocket) => set(() => ({adminSocket: adminSocket}))
})



export const storeAd = create(storeAdmin)

        