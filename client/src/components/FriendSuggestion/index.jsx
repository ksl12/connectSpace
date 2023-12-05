import { Avatar, Box, Card, CardHeader, Stack, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { suggestionFriend } from "../../services/apiServicesUser"
import { store } from "../../state/store"
import { useNavigate } from "react-router-dom"

const FriendSuggestion = () => {
    const [suggestion, setSuggestion] = useState([])
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    const navigate = useNavigate()
    const isMedium = useMediaQuery("(min-width: 775px)")
    useEffect(() => {
        let ignore = false
        const fetchSuggestion = async () => {
            let res = await suggestionFriend(user.user_ID, token)
            if(!ignore) {
                setSuggestion(res) 
            }
        }
        fetchSuggestion()
        return () => {
            ignore = true
        }
    }, [])

    const changeToProfileFriend = (e, id) => {
        navigate("/profile/" + id, {replace: true})
    }
    return (
        <>
            {isMedium &&
                <Box flexGrow={3} flexBasis="30%">
                    <Stack>
                        <Box ml="2rem" bgcolor="white">
                            <Typography fontWeight="bold" ml="0.5rem">Đề xuất kết bạn</Typography>
                            <Stack gap={2} mt={1}>
                                {suggestion.length > 0 &&
                                    suggestion.map((friend, index) => (
                                        <Card key={friend.user_ID} sx={{border: "1px red"}}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar 
                                                        src={"/upload/" + friend.avatar} 
                                                        aria-label="recipe" 
                                                        sx={{cursor: "pointer"}} 
                                                        onClick={(e) => changeToProfileFriend(e, friend.user_ID)}
                                                    />
                                                }
                                                title={
                                                    <Typography sx={{cursor: "pointer"}} onClick={(e) => changeToProfileFriend(e, friend.user_ID)}>
                                                        {friend.firstName + " " + friend.lastName}
                                                    </Typography>
                                                }
                                            />
                                        </Card>
                                    ))
                                }
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            }
        </>
    ) 
}

export default FriendSuggestion