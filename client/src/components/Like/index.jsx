import { Box, IconButton, Typography } from "@mui/material"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useEffect, useState } from "react"
import { addNewLike, getNumberLike, unLike } from "../../services/apiServiceLike";
import { store } from "../../state/store";
const Like = ({post}) => {
    const [like, setLike] = useState([])
    const token = store((state) => state.token) 
    const user = store((state) => state.user) 
    useEffect(() => {
        (async () => {
            try {
                let numberLike = await getNumberLike(post, token)
                setLike(numberLike)
                // console.log(numberLike)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const handleLike = async () => {
        try {
            let form = new FormData()
            form.append("userID", user.user_ID)
            form.append("postID", post)
            if(like.includes(user.user_ID)) {
                await unLike(user.user_ID, post, token)
                let numberLike = await getNumberLike(post, token)
                setLike(numberLike)
                // console.log("1")
            }
            else {
                await addNewLike(form, token)
                let numberLike = await getNumberLike(post, token)
                setLike(numberLike)
            }
            // console.log()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Box sx={{fontSize: "15px", display: "flex", alignItems: "center", position: "relative", top: "2px"}}>
            <Typography sx={{position: "relative", top: "2px", fontSize: "15px"}}>{like?.length}</Typography>
            {like.includes(user.user_ID)?
                <IconButton onClick={handleLike}>
                    <ThumbUpIcon sx={{color: "blue"}} />
                </IconButton>
                : 
                <IconButton onClick={handleLike}>
                    <ThumbUpIcon />
                </IconButton>
            }
        </Box>
    ) 
}

export default Like