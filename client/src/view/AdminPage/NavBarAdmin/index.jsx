import { AppBar, Avatar, Box, Button, Divider, Drawer, Icon, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from "@mui/material"
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import {useColorScheme} from '@mui/material/styles';
import { useTheme } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../../state/store";
import { useState } from "react";
import { logout } from "../../../services/apiServicesAuth";
import { storeAd } from "../../../state/storeAdmin";

const drawerWidth = 240;
const navItems = [
    {
        id: 1,
        path: "/admin",
        name: "Thống Kê"
    },
    {
        id: 2,
        path: "/UserManage",
        name: "Người Dùng"
    },
    {
        id: 3,
        path: "/PostManage",
        name: "Bài Đăng"
    }
];

const NavBarAdmin = (props) => {
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [mobileOpen, setMobileOpen] = useState(false);
    const { window } = props;
    const { mode, setMode } = useColorScheme()
    const theme = useTheme()
    const user = store((state) => state.user)
    const clearSession = store((state) => state.clearSession)
    const adminSocket = storeAd((state) => state.adminSocket)

    const navigate = useNavigate()
    const location = useLocation()
    const open = Boolean(anchorElUser);
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
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Connect Space
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
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
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <AppBar component="nav">
            <Toolbar
                sx={{justifyContent: "space-between", mt: "0.2rem"}}
            >   
                <Box display="flex" alignItems="center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography color="white" fontWeight="bold" sx={{cursor:"pointer"}} onClick={() => {navigate("/home", { replace: true })}}>CONNECT SPACE</Typography>
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
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                        <Button 
                            key={item.id} 
                            sx={{ 
                                color: '#fff', 
                                fontWeight: "bold", 
                                fontSize: "0.8rem", 
                                color: (location.pathname === item.path) ? "red" : (mode === "light")
                                ? theme.colorSchemes.dark.palette.background.alt
                                : theme.colorSchemes.light.palette.background.alt 
                            }}
                            onClick={() => 
                            {
                                navigate(item.path, { replace: true })
                            }}
                        >
                            {item.name}
                        </Button>
                    ))}
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <ModeToggle />
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Tài khoản">
                            {
                                user.avatar == null ?
                                <AccountCircleIcon sx={{fontSize: "48px", cursor: "pointer"}} onClick={handleOpenUserMenu}/>
                                :
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    aria-controls={open ? "account-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                >
                                    <Avatar 
                                        alt= "Avatar Người Dùng"
                                        src= {"/upload/" + user.avatar}
                                    />
                                </IconButton>
                            }
                        </Tooltip>
                        <Menu 
                            sx={{ mt: '40px', "&:hover": {cursor: "pointer"}}}
                            id="account-menu"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            // keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClick={handleCloseUserMenu}
                            onClose={handleCloseUserMenu}
                            disableAutoFocusItem
                            slotProps = {{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                        },
                                        '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                        },
                                    },
                                }
                            }}
                        >
                            <MenuItem 
                                onClick={async (e) => 
                                    {
                                        await logout()
                                        clearSession()
                                        adminSocket.disconnect()
                                        handleCloseUserMenu(e)
                                    }}
                            >        
                                Đăng Xuất
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavBarAdmin