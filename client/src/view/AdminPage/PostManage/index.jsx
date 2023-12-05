import { Box, Button, Stack, Typography } from "@mui/material";
import NavBarAdmin from "../NavBarAdmin";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs"
import "dayjs/locale/vi"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from 'dayjs/plugin/timezone';
import { useEffect, useState } from "react";
import { store } from "../../../state/store";
import { listPost } from "../../../services/apiServiceAdmin";
import DeletePost from "./DeletePost";


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("vi")


const PostManage = () => {
    const [reloadData, setReloadData] = useState(false)
    const [rowData, setRowData] = useState([])
    const token = store((state) => state.token) 
    useEffect(() => {
        let ignore = false
        const fetchRowData = async () => {
            let data = await listPost(token)
            let dataRow = []
            for(let post of data) {
                dataRow.push(
                    {
                        id: post.post_ID,
                        firstName: post.content,
                        postUserID: post.postUser_ID,
                        imageURL: post.image_URL,
                        createAT: dayjs.utc(post.createAT).tz('Asia/Bangkok').format("DD/MM/YYYY [lúc] HH:mm") 
                    }
                )
            }
            if(!ignore) {
                setRowData(dataRow)
            }
        }
        fetchRowData()
        return () => {
            ignore = true
        }
    }, [reloadData])

    const columns = [
        { field: "id", headerName: "ID", flex: 1},
        { field: "firstName", headerName: "Nội Dung", flex: 1 },
        {
            field: "createAT",
            headerName: "Ngày Tạo",
            flex: 1,
        },
        {
            field: "postUserID",
            headerName: "ID người đăng",
            flex: 1,
        },
        {
            field: "action",
            headerName: "Xóa bài viết",
            sortable: false,
            flex: 1,
            filterable: false,
            renderCell: (params) => {
                return (
                    <DeletePost userID={params.row.postUserID} postID={params.row.id} setReloadData={setReloadData} reloadData={reloadData} imageURL={params.row.imageURL}/>
                )
            } 
        }
    ];
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
                {rowData.length > 0 ?
                    <DataGrid 
                        disableRowSelectionOnClick
                        disableColumnFilter
                        rows={rowData}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                    :
                    <Typography>Hiện chưa có bài viết</Typography>
                }
            </Box>
        </Stack>
    );
}

export default PostManage