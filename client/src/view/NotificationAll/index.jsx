import { Avatar, Badge, Box, Menu, MenuItem, MenuList, Paper, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import PropTypes from 'prop-types';
import ClickSettingNoti from "../../components/ClickSettingNoti";
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect, useState } from "react";
import { store } from "../../state/store";
import { loadAllNoti, loadNoti, readNoti } from "../../services/apiServiceFriend";
import { useNavigate } from "react-router-dom";


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("vi")

const shapeStyles = { bgcolor: "primary.main", height: 10, width: 10};
const shapeCircleStyles = { borderRadius: '50%'};
const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles}} />
);

function CustomTabPanel(props) {
    const { children, value, index, isMedium, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: isMedium ? 3 : 0}}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const NotificationAll = () => {
    const [value, setValue] = useState(0)
    const navigate = useNavigate()
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    const socket = store((state) => state.socket)
    const notificationAll = store((state) => state.notificationAll)
    const notiReadAll = store((state) => state.notiReadAll)
    const setNotificationAll = store((state) => state.setNotificationAll)
    const setNotiReadAll = store((state) => state.setNotiReadAll)
    const now = dayjs.utc()
    const isMedium = useMediaQuery("(min-width: 570px)")
    useEffect(() => { 
        let ignore = false
        const setNoti = async () => {
            let noti = await loadAllNoti(user.user_ID, token)
            if(!ignore) {
                setNotificationAll(noti)
                let notiReaded = noti.filter((noti) => noti.is_read == 0)
                setNotiReadAll(notiReaded)
            }
        }
        if(!ignore) {
            socket?.on("getNotification", async () => {
                let noti = await loadAllNoti(user.user_ID, token)
                setNotificationAll(noti)
                let notiReaded = noti.filter((noti) => noti.is_read == 0)
                setNotiReadAll(notiReaded)
            })
        }
        setNoti()
        return () => {
            socket?.off("getNotification")
            ignore = true
        }
    }, [socket])
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleChangeNoti = async (notiID, sendID, isRead) => {
        navigate("/profile/" + sendID, { replace: true })
        if(isRead == 0) {
            await readNoti(notiID, token)
            let noti = await loadNoti(user.user_ID, token)
            setNotificationAll(noti)
            let notiReaded = noti.filter((noti) => noti.is_read == 0)
            setNotiReadAll(notiReaded)
        }
    }
    return (
        <Box display="flex" flexDirection="column" position="relative" maxwidth="400px" width={isMedium ? "35rem" : "20rem"} m="auto auto">
            <Paper>
                <MenuList>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" fontWeight="bold" ml="1rem">Thông Báo</Typography>
                        <ClickSettingNoti userID={user.user_ID}/>
                    </Box>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Tất Cả" {...a11yProps(0)} />
                            <Tab label="Chưa Đọc" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={value} index={0} isMedium={isMedium}>
                        <Box>
                            {notificationAll?.length == 0 ?
                                <Typography>Bạn chưa có thông báo mới</Typography>
                                : 
                                notificationAll?.map( (noti) => (
                                    <MenuItem 
                                        key={noti.notification_ID} 
                                        onClick={(e) => {handleChangeNoti(noti.notification_ID, noti.sender_ID, noti.is_read)}}
                                        sx={{gap: "0.2rem", }}
                                    >
                                        <Avatar src={"/upload/" + noti.avatar}/>
                                        <Box display="flex" flexDirection="column" gap="0.2rem" sx={{wordWrap: "break-word"}} width="100vw">
                                            <Typography
                                                component="p"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: "1",
                                                    WebkitBoxOrient: "vertical",
                                                    whiteSpace: "pre-line",
                                                    ml: 1
                                                }}
                                            >
                                                {noti.notification_message}
                                            </Typography>
                                            <Typography variant="caption" ml={1} color={noti.is_read === 0 ? "primary" : "initial"}>{dayjs.utc(noti.createAT).from(now)}</Typography>
                                        </Box>
                                        {noti.is_read === 0 
                                        ?
                                            <Badge color="primary" overlap="circular" badgeContent="" sx={{ml: "0.5rem", "& .MuiBadge-badge": {height: "0px", minWidth: "0px"}}}>
                                                {circle}
                                            </Badge>
                                        :       
                                            null
                                        }
                                    </MenuItem>
                                ))
                            }
                        </Box>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1} isMedium={isMedium}>
                        {notificationAll?.length == 0 ?
                            <Typography>Bạn chưa có thông báo mới</Typography>
                            : 
                            notiReadAll?.length == 0 
                            ? 
                                <MenuItem 
                                    sx={{maxWidth: "calc(100% - 32px)", 
                                    maxHeight: "calc(100% - 96px)", 
                                    width: "346.7px", 
                                    height: "calc(80% + 32px)", 
                                    "&:hover": {bgcolor: "white"}}}
                                >
                                    <Typography>Bạn đã đọc hết thông báo</Typography>   
                                </MenuItem>
                            :
                            notiReadAll?.map((noti) => (
                                <MenuItem 
                                    key={noti.notification_ID} 
                                    sx={{gap: "0.2rem", maxWidth: "calc(100% - 32px)"}} 
                                    onClick={(e) => {handleChangeNoti(noti.notification_ID, noti.sender_ID, noti.is_read)}}
                                >
                                    <Avatar src={"/upload/" + noti.avatar}/>
                                    <Box display="flex" flexDirection="column" gap="0.2rem" sx={{wordWrap: "break-word"}} width="100vw">
                                        <Typography
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: "1",
                                                WebkitBoxOrient: "vertical",
                                                whiteSpace: "pre-line",
                                                ml: 1
                                            }}
                                        >
                                            {noti.notification_message}
                                        </Typography>
                                        <Typography variant="caption" ml={1} color={noti.is_read === 0 ? "primary" : "initial"}>{dayjs.utc(noti.createAT).from(now)}</Typography>
                                    </Box>
                                    {noti.is_read === 0 
                                    ?
                                        <Badge color="primary" overlap="circular" badgeContent="" sx={{ml: "0.5rem", "& .MuiBadge-badge": {height: "0px", minWidth: "0px"}}}>
                                            {circle}
                                        </Badge>
                                    :       
                                        null
                                    }
                                </MenuItem>
                            ))
                        }
                    </CustomTabPanel>
                    
                </MenuList>
            </Paper>
        </Box>
    );
}

export default NotificationAll