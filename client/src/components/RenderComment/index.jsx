import { Box, Stack} from "@mui/material"
import { useState } from "react"
import { store } from "../../state/store";
import CommentContent from "../CommentContent";


const RenderComment = ({comments, parentID = -1, level = 0, post, reloadData}) => {
    return (
        <Stack sx={{fontSize: "15px", justifyContent: "center", mx: "15px", gap: "10px"}}>
            {
                comments
                .filter((comment) => comment.parent_comment_ID === parentID)
                .map( (comment) => (
                    <CommentContent key={comment.comment_ID} comments={comments} comment={comment} disableReply={level >= 2} post={post} reloadData={reloadData}>
                        {<RenderComment comments={comments} parentID={comment.comment_ID} level={level + 1} post={post} reloadData={reloadData}/>}
                    </CommentContent>           
                ))
            }

        </Stack>
      
    ) 
}

export default RenderComment