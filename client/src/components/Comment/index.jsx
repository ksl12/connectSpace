import { Box, IconButton, Typography } from "@mui/material"
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from "react"
import { getNumberComment} from "../../services/apiServiceComment";
import { store } from "../../state/store";
const Comment = ({post, onPostClick, reload}) => {
    const [numComment, setNumComment] = useState([])
    const token = store((state) => state.token) 
    useEffect(() => {
        (async () => {
            try {
                let numberComment = await getNumberComment(post, token)
                setNumComment(numberComment)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [reload])
    const handleClick = () => {
        onPostClick(post)
    }    
    return (
        <Box sx={{fontSize: "15px", display: "flex", alignItems: "center", position: "relative", top: "1px"}} onClick={handleClick}>
            <Typography sx={{position: "relative", ml: "5px" ,top: "2px", fontSize: "15px"}}>{numComment}</Typography>
            <IconButton>
                <CommentIcon sx={{position: "relative", top: "3.5px"}} />
            </IconButton>
        </Box>
    ) 
}

export default Comment