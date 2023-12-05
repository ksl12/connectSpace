import * as yup from "yup"
import {Formik} from "formik"
import dayjs from "dayjs"
import {AdapterDayjs}  from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider}  from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import { Avatar, Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, useTheme } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { useEffect, useRef, useState } from "react";
import { store } from "../../state/store.js";
import { getInfoUpdate, updateUser } from "../../services/apiServicesUser.js";
import { addImage, deleteImage } from "../../services/apiServicesPost.js";

const conditionUpdate = yup.object().shape({
    avatar: yup.mixed().nullable()
    .test("FILE_SIZE", "Kích thước ảnh quá lớn", value => (value && !value.size) || (value && value.size <= 100 * 1024) )
    .test("FILE_TYPE", "Loại ảnh không phù hợp", value => (value && !value.type) || (value && whitelist.includes(value.type)) ),
    firstName: yup.string().trim("Không được để trống").required("Họ không được để trống").min(3, "Không được dưới 3 ký tự").max(50, "Không được trên 50 ký tự"),
    lastName: yup.string().trim("Không được để trống").required("Tên không được để trống").min(3, "Không được dưới 3 ký tự").max(50, "Không được trên 50 ký tự"),
    email: yup.string().trim("Không được chứa khoảng trắng").required("Email không được để trống").email("Email không đúng định dạng"),
    phoneNumber: yup.string().matches(/^\d{10}$/).required("Bắt buộc").min(10, "Số điện thoại phải đủ 10 chữ số").max(10, "Số điện thoại phải đủ 10 chữ số"),
    gender: yup.number().nullable().required("Bắt buộc").min(0).max(2),
    dateOFBirth: yup.date(dayjs()).nullable().max(dayjs(new Date()), "Ngày nhập không được lớn hơn hôm nay").required("Không được để trống") // MM-DD-YYYY
})

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

const FormUpdate = ({handleClose, handleReload}) => {
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [initialValuesUpdate, setInitialValuesUpdate] = useState({
        avatar: null,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: 0,
        dateOFBirth: dayjs()
    })
    const inputRef = useRef();
    const user = store((state) => state.user)
    const token = store((state) => state.token) 
    // const setRole = store((state) => state.setRole)
    const setToken = store((state) => state.setToken)
    const theme = useTheme()
    const light = theme.colorSchemes.light

    useEffect(() => {
        let ignore = false
        const fetchInfoUser = async () => {
            if(!ignore) {
                setInitialValuesUpdate({
                    avatar: user.avatar,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    dateOFBirth: user.dateOFBirth
                }) 
            }
        }
        fetchInfoUser()
        return () => {
            ignore = true
        }
    }, [])
    const handleUploadImage = async () => {
        try {
            const formData = new FormData()
            formData.append("file", avatarPreview);
            const res = await addImage(formData)
            return res
        } catch (error) {
            console.log(error)
        }
    }
    const handleFormSubmit = async (values, propsSubmit) => {
        try {
            let imgUrl = ""
            if(avatarPreview !== null) {
                imgUrl = await handleUploadImage()
            }
            const formData = new FormData()
            for (let value in values) {
                if(value == "avatar" && imgUrl == "") {
                    formData.append("avatar", user.avatar)
                }
                else if(value == "avatar" && imgUrl !== "") {
                    formData.append("avatar", imgUrl)
                }
                else {
                    formData.append(value, values[value])
                }
            }
            console.log(...formData)
            let res = await updateUser(formData, user.user_ID,token)
            if(res.messages == "Update user successful") {
                if(avatarPreview !== null) {
                    if(user.avatar) {
                        await deleteImage(user.avatar)
                    }
                }
                let newUser = await getInfoUpdate(user.user_ID, token)
                setToken(newUser.user, token)
                setAvatarPreview(null)
                handleClose()
                handleReload()
            }
        } catch (error) {
            if(error) {
                alert("Cập nhật không thành công")
            }
        }
        propsSubmit.resetForm()
    }

    const handleClick = () => {
        inputRef.current.click()
        
    }
    
    return (
        <Formik
            enableReinitialize
            onSubmit={handleFormSubmit}
            initialValues={initialValuesUpdate}
            validationSchema={conditionUpdate}
        >
            {
                ({// prop formil
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap = "15px"
                        >   
                            <Box onClick={handleClick} display="flex" justifyContent="center">
                                <Box mb="-10px">
                                    {avatarPreview ? 
                                        (
                                            <Avatar src={URL.createObjectURL(avatarPreview)} sx={{ height: "50px", width: "50px" }}/>
                                        )
                                        :
                                        <Avatar src={"/upload/" + user.avatar} sx={{ height: "50px", width: "50px" }}/>
                                    }
                                    <IconButton>
                                        <UploadIcon style={{position: "absolute", transform: "translate(85%,-140%)"}} fontSize="medium"/>
                                    </IconButton>
                                    <input    
                                        style={{display: "none"}}
                                        type="file"
                                        accept='image/*'
                                        hidden
                                        onChange={(e) => {
                                            if(e.target.files[0]) {
                                                setAvatarPreview(e.target.files[0])
                                                setFieldValue("avatar", e.target.files[0])
                                            }
                                        }}
                                        ref={inputRef}
                                        name="avatar"
                                    />
                                </Box>
                            </Box>
                            {touched.avatar && errors.avatar ? (
                                <div>{touched.avatar && errors.avatar}</div>)
                                : null
                            }
                            <TextField 
                                label = "Họ"
                                onBlur = {handleBlur}
                                onChange = {handleChange}
                                value = {values.firstName}
                                name = "firstName"
                                error = {
                                    Boolean(touched.firstName) && Boolean(errors.firstName)
                                } 
                                helperText = {touched.firstName && errors.firstName}
                                autoComplete= "off"
                            />

                            <TextField 
                                label = "Tên"
                                onBlur = {handleBlur}
                                onChange = {handleChange}
                                value = {values.lastName}
                                name = "lastName"
                                error = {
                                    Boolean(touched.lastName) && Boolean(errors.lastName)
                                } 
                                helperText = {touched.lastName && errors.lastName}
                                autoComplete= "off"
                            />

                            <TextField 
                                fullWidth
                                label = "Email"
                                onBlur = {handleBlur}
                                onChange = {handleChange}
                                value = {values.email}
                                name = "email"
                                error = {
                                    Boolean(touched.email) && Boolean(errors.email)
                                } 
                                helperText = {touched.email && errors.email}
                                autoComplete= "off"
                            />

                            <TextField 
                                fullWidth
                                label = "Số điện thoại"
                                onBlur = {handleBlur}
                                onChange = {handleChange}
                                value = {values.phoneNumber}
                                name = "phoneNumber"
                                error = {
                                    Boolean(touched.phoneNumber) && Boolean(errors.phoneNumber)
                                } 
                                helperText = {touched.phoneNumber && errors.phoneNumber}
                                autoComplete= "off"
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label = "Ngày sinh (MM/DD/YYYY)"
                                    name = "dateOFBirth"
                                    format="MM/DD/YYYY"
                                    maxDate={dayjs(new Date())}
                                    value={dayjs(values.dateOFBirth) || dayjs()}
                                    onBlur = {handleBlur}
                                    onChange={(date) => {
                                        setFieldValue("dateOFBirth", date)}
                                    }
                                    slotProps={
                                        { textField: 
                                            {placeholder: "MM/DD/YYYY", 
                                            fullWidth: true, 
                                            error: Boolean(touched.dateOFBirth) && Boolean(errors.dateOFBirth),
                                            helperText: touched.dateOFBirth && errors.dateOFBirth,
                                            InputLabelProps: {style: {fontSize: "15px", fontWeight: "bold"}}
                                            }
                                        }}
                                    render
                                />
                            </LocalizationProvider>

                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{fontSize: "1rem", fontWeight: "700"}}>Giới tính</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="Giới tính"
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                    onBlur = {handleBlur}
                                >   
                                    <FormControlLabel value={0} control={<Radio />} label="Nam" /> 
                                    <FormControlLabel value={1} control={<Radio />} label="Nữ" />
                                    <FormControlLabel value={2} control={<Radio />} label="Khác" />
                                </RadioGroup>
                                {touched.gender && errors.gender ? (
                                    <div>{touched.gender && errors.gender}</div>)
                                    : null
                                }
                            </FormControl>

                            {/* Button update info*/}
                            <Box
                                sx={{minWidth: "50%"}}
                            >
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{
                                        p: "1rem",
                                        backgroundColor: light.palette.primary.main,
                                        color: light.palette.background.alt,
                                        "&:hover": { 
                                            color: light.palette.background.light,
                                            bgcolor: light.palette.neutral.main
                                        },
                                    }}
                                >
                                    Cập Nhật
                                </Button>
                            </Box>
                        </Box>
                    </form>
                )
            }
        </Formik>
    );
}

export default FormUpdate