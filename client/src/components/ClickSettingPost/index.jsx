import { IconButton, Menu, MenuItem} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from "react";
import { store } from "../../state/store";
import { deleteImage, deletePost } from "../../services/apiServicesPost";
import { addNewPS, deletePS, getNumberPS } from "../../services/apiServicePostSaved";
import { useNavigate } from "react-router-dom";

const ClickSettingPost = ({userID, postID, imageURL, reloadData, isDetail}) => {
    const [isSave, setIsSave] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const token = store((state) => state.token) 
    const user = store((state) => state.user) 
    const setPostSaved = store((state) => state.setPostSaved)
    const navigate = useNavigate()
    useEffect(() => {
        let ignore = false
        const fetchPS = async () => {
            let res = await getNumberPS(user.user_ID, token)
            const arrPS = res.map(post => post.post_ID)
            if(!ignore) {
                setPostSaved(res) 
                if(arrPS.includes(postID)) {
                    setIsSave(true)
                }
            }
        }
        fetchPS()
        return () => {
            ignore = true
        }
    }, [])
    const handleClickSetting = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseSetting = async() => {
        await deletePost(postID, token)
        if(imageURL) {
            await deleteImage(imageURL)
        }
        handleClose()
        if(isDetail !== 1) {
            reloadData()
        } 
        navigate("/home", { replace: true })
    }
    const handleSavedSetting = async() => {
        const formData = new FormData()
        formData.append("userID", user.user_ID)
        formData.append("postID", postID)
        await addNewPS(formData, token)
        handleClose()
        setIsSave(!isSave)
        navigate("/home", { replace: true })
    }
    const handleUnSavedSetting = async() => {
        await deletePS(user.user_ID, postID, token)
        setIsSave(!isSave)
        navigate("/home", { replace: true })
        handleClose()
    }

    const handleClose = () => {
        setAnchorElUser(null)
    }
    return (
        <>
            <IconButton  onClick={handleClickSetting}>
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
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
                {userID ===  user.user_ID ?
                    <MenuItem onClick={handleCloseSetting}>Xóa bài đăng</MenuItem>
                    :
                    isSave 
                    ?
                    <MenuItem onClick={handleUnSavedSetting}>Xóa bài lưu</MenuItem>
                    :
                    <MenuItem onClick={handleSavedSetting}>Lưu bài đăng</MenuItem>
                }
            </Menu>
        </>
    ) 
}

export default ClickSettingPost