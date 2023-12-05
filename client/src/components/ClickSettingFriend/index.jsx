import { IconButton, Menu, MenuItem} from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from "react";
import { deleteFriend } from "../../services/apiServiceFriend";


const ClickSettingFriend = ({userID, token, friendID, reloadData, reloadFriend}) => {
    const [anchorElUser, setAnchorElUser] = useState(null)
    const handleClickSetting = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseSetting = async() => {
        try {
            const form = new FormData()
            form.append("userID", userID)
            form.append("friendID", friendID)
            await deleteFriend(form, token)
            handleClose()
            reloadData()
            reloadFriend()
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
                id="simple_setting"
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
                <MenuItem onClick={handleCloseSetting}>Xóa bạn</MenuItem>
            </Menu>
        </>
    ) 
}

export default ClickSettingFriend