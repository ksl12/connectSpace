import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import NavBarAdmin from "./NavBarAdmin";
import { useEffect, useState } from "react";
import { getNumberComment, getNumberPost, getNumberUser } from "../../services/apiServiceAdmin";
import { store } from "../../state/store";
import Chart from "./Chart/Chart.";
import { storeAd } from "../../state/storeAdmin";


const AdminPage = () => {
    const [numAllUser, setNumAllUser] = useState([])
    const [numAllPost, setNumAllPost] = useState([])
    const [numAllComment, setNumAllComment] = useState([])
    const socket = store((state) => state.socket)
    const token = store((state) => state.token) 
    const totalActiveUser = storeAd((state) => state.totalActiveUser)
    const setTotalActiveUser = storeAd((state) => state.setTotalActiveUser)
    const adminSocket = storeAd((state) => state.adminSocket)
    useEffect(() => {
        let ignore = false
        const fetchStatistic = async () => {
            let numUser = await getNumberUser(token)
            let numPost = await getNumberPost(token)
            let numComment = await getNumberComment(token)
            // console.log(numUser, numPost, numComment)
            if(!ignore) {
                setNumAllUser(numUser)
                setNumAllPost(numPost)
                setNumAllComment(numComment)
            }
        }
        fetchStatistic()
        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        let ignore = false
        if(!ignore) {
            adminSocket?.on("activeUsers", (totalActive) => {
                setTotalActiveUser(totalActive)
            })
        }
        return () => {
            ignore = true
            adminSocket?.off("activeUsers")
        }
    }, [adminSocket])
    return (
        <Stack position="relative" height="100%" >
            <NavBarAdmin />
            <Box
                width="100%"
                padding="1rem 5%"
                gap="1rem"
                position="relative"
                top="70px"
                display="flex"
                flexWrap="wrap"
            >
                <Card sx={{ maxWidth: 500, flex: "0 0 24%" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tổng số người dùng mới
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="bold">
                            {numAllUser.number}
                        </Typography>
                        {
                            (numAllUser.number / numAllUser.lastweek) > 1 && numAllUser.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {Math.floor((numAllUser.number - numAllUser.lastweek) / numAllUser.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            (numAllUser.number / numAllUser.lastweek) < 1 && numAllUser.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="red">
                                    {Math.floor((numAllUser.number - numAllUser.lastweek) / numAllUser.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            numAllUser.lastweek == 0 
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {numAllUser.number * 100}
                                </Typography> % so với tuần trước
                            </Typography>
                            : 
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    Không thay đổi
                                </Typography> so với tuần trước
                            </Typography>
                        }
                    </CardContent>
                </Card>
                <Card sx={{ maxWidth: 500, flex: "0 0 24%" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tổng số bài đăng mới
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="bold">
                            {numAllPost.number}
                        </Typography>
                        {
                            (numAllPost.number / numAllPost.lastweek) > 1 && numAllPost.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {Math.floor((numAllPost.number - numAllPost.lastweek) / numAllPost.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            (numAllPost.number / numAllPost.lastweek) < 1 && numAllPost.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="red">
                                    {Math.floor((numAllPost.number - numAllPost.lastweek) / numAllPost.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            numAllPost.lastweek == 0 
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {numAllPost.number * 100}
                                </Typography> % so với tuần trước
                            </Typography>
                            : 
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    Không thay đổi
                                </Typography> so với tuần trước
                            </Typography>
                        }
                    </CardContent>
                </Card>
                <Card sx={{ maxWidth: 500, flex: "0 0 24%" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Tổng số bình luận mới
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="bold">
                            {numAllComment.number}
                        </Typography>
                        {
                            (numAllComment.number / numAllComment.lastweek) > 1 && numAllComment.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {Math.floor((numAllComment.number - numAllComment.lastweek) / numAllComment.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            (numAllComment.number / numAllComment.lastweek) < 1 && numAllComment.lastweek > 0
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="red">
                                    {Math.floor((numAllComment.number - numAllComment.lastweek) / numAllComment.lastweek * 100)}
                                </Typography> % so với tuần trước
                            </Typography>
                            :
                            numAllComment.lastweek == 0 
                            ?
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    {numAllComment.number * 100}
                                </Typography> % so với tuần trước
                            </Typography>
                            : 
                            <Typography variant="body1" color="text.secondary" fontWeight="bold" marginTop="0.5rem">
                                <Typography component="span" color="blue">
                                    Không thay đổi
                                </Typography> so với tuần trước
                            </Typography>
                        }
                    </CardContent>
                </Card>
                <Card sx={{ maxWidth: 500, flex: "0 0 24%" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Người dùng đang hoạt động
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="bold">
                            {totalActiveUser}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box 
                // sx={{
                //     transform: {lg: "translateX(30%)"}
                // }}
                mt="4rem"
                width="100%"
            >
                <Chart />
            </Box>
        </Stack>
    );
}

export default AdminPage