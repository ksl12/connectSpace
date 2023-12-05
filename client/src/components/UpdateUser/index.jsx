import { Box, Fab, Modal, Tooltip, Typography, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'
import { useState } from "react";
import FormUpdate from "./FormUpdate";


const UpdateUser = ({handleReload}) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)
    const isMobile = useMediaQuery("(min-width: 460px)")
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? 450 : "100%",
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    return (
        <>
            <Tooltip 
                onClick={handleOpen}
                title="Cập nhật thông tin"
            >
                <Fab color="primary" aria-label="edit" size="small" sx={{ transform: "scale(0.7)"}}>
                    <EditIcon />
                </Fab>
            </Tooltip>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h2" fontWeight="bold" component="h6" align="center" mb="0.4rem">
                        Cập nhật thông tin
                    </Typography>
                    <FormUpdate handleClose={handleClose} handleReload={handleReload}/>
                </Box>
            </Modal>
        </>
    );
}

export default UpdateUser