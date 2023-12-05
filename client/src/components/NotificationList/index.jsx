import { Avatar, Badge, Box, Divider, IconButton, Menu, MenuItem, Tab, Tabs, Typography, useMediaQuery} from "@mui/material"
import PropTypes from 'prop-types';
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import { store } from "../../state/store";
import { loadNoti, readNoti } from "../../services/apiServiceFriend";
import { useLocation, useNavigate } from "react-router-dom";
import ClickSettingNoti from "../ClickSettingNoti";


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("vi")

const shapeStyles = { bgcolor: "primary.main", height: 10, width: 10};
const shapeCircleStyles = { borderRadius: '50%'};
const circle = (
  <Box component="span" sx={{ ...shapeStyles, ...shapeCircleStyles}} />
);

function CustomTabPanel(props) {
    const { children, value, index, isMobile, ...other } = props;
    
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: isMobile ? 3 : 0}} >
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


const NotificationList = ({mode, theme}) => {
    const [value, setValue] = useState(0)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    const notification = store((state) => state.notification)
    const notiRead = store((state) => state.notiRead)
    const setNotification = store((state) => state.setNotification)
    const setNotiRead = store((state) => state.setNotiRead)
    const isSmall = useMediaQuery("(min-width: 390px)")
    const isMobile = useMediaQuery("(min-width: 450px)")
    const now = dayjs.utc()
    const handleClickNoti = (event) => {
        if(!isSmall) {
            navigate("/notifications", { replace: true })
        }
        else {
            const getListNoti = async () => {
                let noti = await loadNoti(user.user_ID, token)
                setNotification(noti)
            }
            if(anchorElUser == null) {
                getListNoti()
            }
            setAnchorElUser(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorElUser(null)
    }
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleChangeNoti = async (notiID, sendID, isRead) => {
        navigate("/profile/" + sendID, { replace: true })
        if(isRead == 0) {
            await readNoti(notiID, token)
            let noti = await loadNoti(user.user_ID, token)
            setNotification(noti)
            let notiReaded = noti.filter((noti) => noti.is_read == 0)
            setNotiRead(notiReaded)
        }
    }

    return (
        <>  
            <IconButton onClick={handleClickNoti}>
                <Badge badgeContent={notiRead?.length > 0 ? notiRead?.length : 0} color="secondary" max={99}>
                    <NotificationsIcon 
                        fontSize= {isMobile ? "large" : "medium"}
                        cursor="pointer" 
                        sx={{
                            color: (location.pathname === "/notifications") ? "red" : (mode === "light")
                            ? theme.colorSchemes.dark.palette.background.alt
                            : theme.colorSchemes.light.palette.background.alt
                        }}
                    />
                </Badge>
            </IconButton>

            <Menu
                id="simple_notilist"
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
                sx={{
                    minWidth: "400px",
                    maxHeight: "calc(100% - 490px)",
                    "& .MuiPaper-root": {
                        overflowY: "hidden",
                    }
                }}
            >   
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" ml="0.4rem">Thông Báo</Typography>
                    <ClickSettingNoti userID={user.user_ID}/>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Tất Cả" {...a11yProps(0)} />
                        <Tab label="Chưa Đọc" {...a11yProps(1)} />
                    </Tabs>
                    <Typography mr="0.3rem" 
                        sx={{
                            cursor: "pointer", 
                            color: "blue", 
                            fontWeight: "bold", 
                            "&:hover": {bgcolor: "rgb(220,220,220)"}
                        }} 
                        onClick={() => {navigate("/notifications", { replace: true })}}    
                    >
                        Xem Tất Cả
                    </Typography>
                </Box>
                <CustomTabPanel value={value} index={0} isMobile={isMobile}>
                    {notification?.length == 0 ?
                        <MenuItem>
                            <Typography>Bạn chưa có thông báo mới</Typography>
                        </MenuItem>
                        : notification?.map( (noti) => (
                            <MenuItem 
                                key={noti.notification_ID} 
                                onClick={(e) => {handleChangeNoti(noti.notification_ID, noti.sender_ID, noti.is_read)}}
                                sx={{gap: "0.2rem"}}
                            >
                                <Avatar src={"/upload/" + noti.avatar}/>
                                <Box display="flex" flexDirection="column" gap="0.2rem">
                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            ml: isMobile ? 1 : 0
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
                <CustomTabPanel value={value} index={1} isMobile={isMobile}>
                    {notification?.length == 0 ?
                        <MenuItem>
                            <Typography>Bạn chưa có thông báo mới</Typography>
                        </MenuItem>
                        : 
                        notiRead?.length == 0 
                        ? 
                            <MenuItem 
                                sx={{
                                    maxWidth: "calc(100% - 32px)", 
                                    maxHeight: "calc(100% - 96px)", 
                                    width: "346.7px", 
                                    height: "calc(80% + 32px)", 
                                    "&:hover": {bgcolor: "white"}
                                }}
                            >
                                <Typography>Bạn đã đọc hết thông báo</Typography>   
                            </MenuItem>
                        :
                        notiRead?.map((noti) => (
                            <MenuItem 
                                key={noti.notification_ID} 
                                sx={{
                                    gap: "0.2rem", 
                                    // maxWidth: "calc(100% - 32px)", 
                                    // maxHeight: "calc(100% - 96px)", 
                                    // width: "346.7px", 
                                    // height: "calc(80% + 32px)", 
                                    "&:hover": {bgcolor: "white"}
                                }} 
                                onClick={(e) => {handleChangeNoti(noti.notification_ID, noti.sender_ID, noti.is_read)}}
                            >
                                <Avatar src={"/upload/" + noti.avatar}/>
                                <Box display="flex" flexDirection="column" gap="0.2rem">
                                    <Typography
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            ml: isMobile ? 1 : 0
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
                {/* <Divider /> */}
            </Menu>
        </>
    ) 
}

export default NotificationList