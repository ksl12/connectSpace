import { Avatar, Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { store } from "../../state/store";
import { useEffect, useState} from "react";
import { getNumberPS } from "../../services/apiServicePostSaved";
import { useNavigate } from "react-router-dom";


const AllPostSaved = () => {
    const token = store((state) => state.token) 
    const user = store((state) => state.user) 
    // const socket = store((state) => state.socket)
    const postSaved = store((state) => state.postSaved)
    const setPostSaved = store((state) => state.setPostSaved)   
    const navigate = useNavigate()
    const isLargeMobile = useMediaQuery("(min-width: 450px)")
    const isSuperLargeMobile = useMediaQuery("(min-width: 510px)")
    useEffect(() => {
        let ignore = false
        const fetchPS = async () => {
            let res = await getNumberPS(user.user_ID, token)
            if(!ignore) {
                setPostSaved(res) 
            }
        }
        fetchPS()
        return () => {
            ignore = true
        }
    }, [])

    // // get signal delete post
    // useEffect(() => {
    //     let ignore = false
    //     if(!ignore) {
    //         socket?.on("deletePost", async (data) => {
    //             if(user.user_ID == data.userID) {
    //                 reloadData()
    //             }
    //         })
    //     }
    //     return () => {
    //         ignore = true
    //         if(!ignore) {
    //             socket?.off("deletePost")
    //         }
    //     }
    // }, [socket])
    return (
        <Stack maxWidth="600px" width="500px" gap = {6}>
            {postSaved.length > 0 
                ? 
                postSaved.map((post, index) => (
                    <Card 
                        sx={{
                            display: "flex" ,
                            // flexDirection: isLargeMobile ? "row" : "column",
                            // alignItems: !isLargeMobile && "center",
                            "&:hover": {
                                cursor: "pointer"
                            }
                        }} 
                        key={post.post_ID} 
                        onClick={() => {navigate("/post/" + post.post_ID, { replace: true })}}
                    >
                        {
                            post.image_URL ?
                            <CardMedia 
                                component="img"
                                sx={{width: 150}}
                                image={"/upload/" + post.image_URL}
                                alt="Ảnh bài đăng"
                            />
                            :
                            <Avatar 
                                variant="rounded"
                                sx={{width: isSuperLargeMobile ? 150 : 150, height: isSuperLargeMobile ? 121 : 125}}
                                image={"/upload/" + post.avatar}
                                alt="Ảnh bài đăng"
                            />
                        }
                        {/* <Box sx={{ display: "flex", flexDirection: "column", minWidth: post.image_URL ? 300 : "100%"}}> */}
                            <CardContent 
                                style={{wordWrap: "break-word"}}
                                sx={{ 
                                    width: 60,
                                    flex: '1 1 auto', 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    minWidth: post.image_URL ? 0 : 0,
                                    textAlign: !isLargeMobile && "center"
                                }} 
                            >
                                <Typography     
                                    // width="90%"
                                    component="div"
                                    variant="h5"
                                    fontSize={isSuperLargeMobile ? 16: 14}
                                    fontWeight="bold"
                                    // width= {(isSuperLargeMobile && !post.image_URL) && "100%"}
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {post.content}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                    Bài viết từ 
                                    <Typography component="span"> {post.firstName + " " + post.lastName}</Typography>
                                </Typography>
                            </CardContent>
                        {/* </Box> */}
                    </Card>
                ))
                :
                <Typography>Bạn chưa có bài lưu nào</Typography>
            }
        </Stack>
    );
}

export default AllPostSaved