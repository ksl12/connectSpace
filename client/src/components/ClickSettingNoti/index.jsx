import { IconButton, Menu, MenuItem, Typography} from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import { useRef, useState } from "react";
import { loadAllNoti, loadNoti, readAllNoti } from "../../services/apiServiceFriend";
import { store } from "../../state/store";


const ClickSettingNoti = ({userID}) => {
    const [anchorElUser, setAnchorElUser] = useState(null)
    const token = store((state) => state.token) 
    const setNotification = store((state) => state.setNotification)
    const setNotiRead = store((state) => state.setNotiRead)
    const setNotificationAll = store((state) => state.setNotificationAll)
    const setNotiReadAll = store((state) => state.setNotiReadAll)
    const allRead = useRef(false)
    const handleClickSetting = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleMaskAllRead = async() => {
        try {
            let notiReaded
            if(allRead.current == false) {
                await readAllNoti(userID, token)
                let noti = await loadNoti(userID, token)
                setNotification(noti)
                notiReaded = noti.filter((noti) => noti.is_read == 0)
                setNotiRead(notiReaded)

                let notiAll = await loadAllNoti(userID, token)
                setNotificationAll(notiAll)
                notiReadedAll = notiAll.filter((noti) => noti.is_read == 0)
                setNotiReadAll(notiReadedAll)
                allRead.current = true
            }
            handleClose()
        } catch (error) {
            console.log(error)
        }
    };
    const handleClose = () => {
        setAnchorElUser(null)
    };
    return (
        <>
            <IconButton sx={{"&:hover": {backgroundColor: "initial"}}} onClick={handleClickSetting}>
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="simple_setting-noti"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleClose}
            >
                <MenuItem onClick={!allRead.current ? handleMaskAllRead : handleClose} sx={{"&:hover": {bgcolor: !allRead.current ? "white" : "initial", cursor: allRead.current ? "not-allowed" : "pointer"}}}>
                    <CheckIcon />
                    {
                        allRead.current 
                        ?
                        <Typography ml="0.2rem" sx={{cursor: "not-allowed"}} fontWeight="100">Đánh dấu tất cả là đã đọc</Typography>
                        :
                        <Typography ml="0.2rem">Đánh dấu tất cả là đã đọc</Typography>
                    }
                </MenuItem>
            </Menu>
        </>
    ) 
}

export default ClickSettingNoti