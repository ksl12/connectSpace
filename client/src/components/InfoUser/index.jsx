import { Avatar, Box, Card, CardHeader, Divider, Stack, useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getInfo } from "../../services/apiServicesUser"
import { getNumberFriend } from "../../services/apiServiceFriend";
import ActionFriend from "../ActionFriend";


const InfoUser = ({token}) => {
    const [reload, setReload] = useState(false)
    const [infoUser, setInfoUser] = useState(null)
    const { mode } = useColorScheme()
    let { userID } = useParams()
    useEffect(() => {
        let first = true
        const fetchInfo = async () => {
            if(first && userID) {
                try {
                    let info = await getInfo(userID, token)
                    let numFriend = await getNumberFriend(userID, token)
                    if(info && numFriend) {
                        setInfoUser({info, numFriend})
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchInfo()
        return () => {
            first = false
        }
    }, [userID, reload])
    const handleReload = () => {
        setReload(!reload)
    }
    return (
        <Box flex={3} flexBasis="30%">
            <Stack
                sx={{backgroundColor: (mode === "light" ? "white" : "rgb(169,169,169)")}}
                borderRadius= "1rem"
                px="10px"
            >   
                <Card sx={{my: "1rem"}}>
                    <CardHeader 
                        avatar={
                            <Avatar src={"/upload/" + infoUser?.info?.avatar} aria-label="recipe" />
                        }
                        action={
                            <ActionFriend token={token} handleReload={handleReload}/>
                        }
                        title={(infoUser?.info) ? infoUser.info?.firstName + " " + infoUser.info?.lastName : ""}
                        titleTypographyProps={{fontSize: "18px"}}
                        subheader= {(infoUser?.numFriend[0]) ? infoUser.numFriend[0]?.numberFriend + " bạn": ""}
                    />
                </Card>
                <Divider sx={{ margin: "0.5rem 0" }}/>
            </Stack>
        </Box>
    );
}

export default InfoUser