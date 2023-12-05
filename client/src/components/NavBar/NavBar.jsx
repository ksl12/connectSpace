import { AppBar, Box, TextField, Toolbar, Typography, IconButton, Avatar, Tooltip, Menu, MenuItem, ListItem, ListItemAvatar, ListItemText, Stack, ClickAwayListener, List, Drawer, Divider, ListItemButton, useMediaQuery, Icon, Button} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useColorScheme} from '@mui/material/styles';
import { useTheme } from "@emotion/react";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { searchUser } from "../../services/apiServicesUser"
import { store } from "../../state/store"
import { logout } from "../../services/apiServicesAuth";
import NotificationList from "../NotificationList";
import { loadNoti } from "../../services/apiServiceFriend";

const drawerWidth = 240;

const NavBar = (props) => {

    const [newUser, setNewUser] = useState([])
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedSearch, setSelectedSearch] = useState(-1)
    const { window } = props;
    const searchRef = useRef(null)
    const isMedium = useMediaQuery("(min-width: 775px)")
    const isMobile = useMediaQuery("(min-width: 450px)")
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    const socket = store((state) => state.socket)
    const setNotification = store((state) => state.setNotification)
    const setNotiRead = store((state) => state.setNotiRead)
    const { mode, setMode } = useColorScheme()
    const theme = useTheme()
    let userID = user.user_ID
    const clearSession = store((state) => state.clearSession)
   
    const navigate = useNavigate()
    const location = useLocation()
    const settings = [
        {
            name: "Trang cá nhân",
            path: "/profile/"

        },
        {
            name: "Đã lưu",
            path: "/bookmark/"

        },
        {
            name: "Đăng xuất",
            path: "/"

        }
    ];
    const navBarIcons = [
        {
            id: 1,
            path: "/home",
            name: "Trang Chủ",
            icon: HomeIcon
        },
        {
            id: 2,
            path: "/friend",
            name: "Bạn Bè",
            icon: PeopleAltIcon
        },
        {
            id: 3,
            path: "/profile/" + `${userID}`,
            name: "Trang Cá Nhân",
            icon: PersonIcon
        }
    ]

    useEffect(() => { 
        let ignore = false
        const setNoti = async () => {
            let noti = await loadNoti(user.user_ID, token)
            if(!ignore) {
                setNotification(noti)
                let notiReaded = noti.filter((noti) => noti.is_read == 0)
                setNotiRead(notiReaded)
            }
        }
        if(!ignore) {
            socket?.on("getNotification", async () => {
                let noti = await loadNoti(user.user_ID, token)
                setNotification(noti)
                let notiReaded = noti.filter((noti) => noti.is_read == 0)
                setNotiRead(notiReaded)
            })
        }
        setNoti()
        return () => {
            socket?.off("getNotification")
            ignore = true
        }
    }, [socket])
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleKeyDown = (e) => {
        if(e.key === "ArrowUp" && selectedSearch > 0) {
            setSelectedSearch(prev => prev - 1)
        }
        else if (e.key === "ArrowDown" && selectedSearch < newUser.length - 1) {
            setSelectedSearch(prev => prev + 1)
        }
        else if((e.key === "Enter") && selectedSearch >= 0) {
            navigate("/profile/" + newUser[selectedSearch].user_ID, { replace: true })
            setSelectedSearch(-1)
            setNewUser([])
        }
        else {
            setSelectedSearch(-1)
        }
    }

    const handleClickAway = () => {
        setSelectedSearch(-1)
        setNewUser([])
    }

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    function ModeToggle() {
        return (
            <IconButton sx={{ ml: 1 }} 
                onClick={() => {
                    setMode(mode === 'light' ? 'dark' : 'light');
                }}
                color="inherit"
            >
                {mode === 'dark' ? <Brightness7Icon fontSize="large"/> : <Brightness4Icon fontSize="large"/>}
            </IconButton>
        );
    }
    const searchNewUser = async(value) => {
        value = value.trim()
        const search = {"name": value, "userID" : user.user_ID}
        if(value === "" || value == " ") {
            setNewUser([{user_ID: "", firstName: "", lastName: "", avatar: null}])
        }
        else {
            let infoUser = await searchUser(search, token)
            if(infoUser.user.length !== 0 ) {
                setNewUser(
                    infoUser.user
                )
            }
            else if(infoUser.user.length == 0) {
                setNewUser([])
            }
        }
    }
    
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Connect Space
            </Typography>
            <Divider />
            <List>
                {navBarIcons.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton 
                            sx={{ textAlign: 'center' }} 
                            onClick={() => 
                            {
                                navigate(item.path, { replace: true })
                            }}
                        >
                            <ListItemText primary={item.name} sx={{fontSize: "0.8rem", fontWeight: "bold",  
                                color: '#fff', 
                                fontWeight: "bold", 
                                fontSize: "0.8rem", 
                                color: (location.pathname === item.path) ? "red" : (mode === "light")
                                ? theme.colorSchemes.dark.palette.background.alt
                                : theme.colorSchemes.light.palette.background.alt 
                            }}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <ModeToggle />
        </Box>
    );
    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <AppBar>
            <Toolbar
                sx={{justifyContent: "space-between", mt: "0.2rem"}}
            >
                <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: isMedium ? "none" : "block" }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography 
                        color="white" 
                        fontWeight="bold" 
                        sx={{cursor:"pointer", display: isMedium ? "block" : "none" }} onClick={() => {navigate("/home", { replace: true })}}
                    >
                        CONNECT SPACE
                    </Typography>
                </Box>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: isMedium ? "none" : "block",
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Stack  
                    gap={2}
                    position= "relative"
                >
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <TextField label="Tìm Bạn" type="search" 
                            defaultValue=""
                            style={{minWidth: isMedium ? "300px" : "60px"}}
                            autoComplete="off"
                            sx={
                                {   
                                    color: "#005B41",
                                    borderColor: "black",
                                    "& label.Mui-focused": {
                                        fontWeight: "800",
                                        color: "black"
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: "green"
                                        }
                                    },
                                    // display: isMobile ? "inline-flex" : "none",
                                }
                            }
                            onChange={async (e) => {
                                await searchNewUser(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            ref={searchRef}
                        />
                    </ClickAwayListener>
                    <List sx={{position: "absolute", top: "2.4rem", width: "100%"}}>
                        { newUser.map((element, index) => (
                                element.user_ID !== "" && (
                                    <ListItem key={index} 
                                        sx={{ 
                                        backgroundColor: (selectedSearch === index && mode === "light") 
                                        ? theme.colorSchemes.dark.palette.background.alt
                                        : (selectedSearch === index && mode === "dark") 
                                        ? theme.colorSchemes.light.palette.background.alt
                                        : "gray", 
                                        color: (selectedSearch === index && mode === "light") 
                                        ? "#fff"
                                        : (selectedSearch === index && mode === "dark") 
                                        ? "rgba(0,0,0,0.87)"
                                        : "white", 
                                        "&:hover": {
                                            backgroundColor: (mode === "light") ? theme.colorSchemes.dark.palette.background.alt : theme.colorSchemes.light.palette.background.alt,
                                            color: (mode === "light") ? "whitesmoke" : "black"
                                        }}}
                                        onClick={() => {
                                            navigate("/profile/" + element.user_ID, { replace: true })
                                        }} 
                                    >
                                        <ListItemAvatar sx={{cursor: "pointer"}}>
                                            <Avatar src={"/upload/" + element.avatar} />
                                        </ListItemAvatar> 
                                        <ListItemText 
                                            primary = {element.firstName + " " + element.lastName}
                                            sx={{cursor: "pointer"}}
                                        />
                                    </ListItem> 
                                )
                            ))
                        }
                    </List>
                </Stack>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box display={!isMobile && "none"}><ModeToggle /></Box>
                    {navBarIcons.map(icons => (
                        <icons.icon  fontSize="large" cursor="pointer" key={icons.id} 
                            sx={{color: (location.pathname === icons.path) ? "red" : (mode === "light")
                                ? theme.colorSchemes.dark.palette.background.alt
                                : theme.colorSchemes.light.palette.background.alt,
                                display: isMedium ? "block" : "none"
                            }}
                            onClick={() => 
                            {
                                navigate(icons.path, { replace: true })
                            }}
                        />
                    ))}
                    <NotificationList mode={mode} theme={theme}/>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Tài khoản">
                            {
                                user.avatar == null ?
                                <AccountCircleIcon sx={{fontSize: "48px", cursor: "pointer"}} onClick={handleOpenUserMenu}/>
                                :
                                <Avatar 
                                    alt= "Avatar Người Dùng"
                                    src= {"/upload/" + user.avatar}
                                    onClick={handleOpenUserMenu}
                                />
                            }
                        </Tooltip>
                        <Menu 
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            disableAutoFocusItem
                        >
                            {settings.map((setting) => (
                                <MenuItem 
                                    key={setting.name} 
                                    onClick={async (e) => 
                                        {
                                            if(setting.path === "/profile/"){
                                                navigate(setting.path + `${userID}`, { replace: true })
                                            }
                                            else if(setting.path === "/bookmark/") {
                                                navigate(setting.path, { replace: true })
                                            }
                                            else {
                                                await logout()
                                                clearSession()
                                                socket.disconnect()
                                                navigate(setting.path, { replace: true })
                                            }
                                            handleCloseUserMenu(e)
                                        }}
                                >        
                                        {setting.name}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar