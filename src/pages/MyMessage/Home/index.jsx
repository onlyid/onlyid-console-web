import { useEffect, useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputAdornment
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import request from "@/my/request"
import { eventEmitter } from "@/my/utils"
import selectBar from "@/components/SelectBar.module.css"
import MessageTable from "./MessageTable"
import DialogClose from "@/components/DialogClose"
import { useHistory } from "react-router-dom"

export default function MyMessage() {
    const [loading, setLoading] = useState(true)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const myMessage = useSelector((state) => state.myMessage)
    const dispatch = useDispatch()
    const history = useHistory()

    const { current, pageSize, keyword } = myMessage

    const initData = async () => {
        setLoading(true)

        const params = { current, pageSize, keyword }
        const { list, total } = await request.get("my-messages", { params })

        if (list.length || current === 1) {
            dispatch({ type: "myMessage", list, total })
            setLoading(false)
        } else {
            dispatch({ type: "myMessage", current: current - 1 })
        }
    }

    useEffect(() => {
        initData()
    }, [current, pageSize])

    const toggleConfirm = () => {
        setConfirmOpen((value) => !value)
    }

    const markReadAll = async () => {
        await request.put("my-messages/mark-read-all")
        await initData()
        eventEmitter.emit("app/openToast", { text: "操作成功", timeout: 2000 })
        eventEmitter.emit("myMessage/countChange")
        toggleConfirm()
    }

    const onPaginationChange = ({ pageSize, current }) => {
        dispatch({ type: "myMessage", pageSize, current })
    }

    const onChange = ({ target }) => {
        dispatch({ type: "myMessage", [target.name]: target.value })
    }

    const onSearch = () => {
        // current=1时，手动发起请求
        if (current === 1) initData()
        else dispatch({ type: "myMessage", current: 1 })
    }

    const goNotification = () => {
        history.push("/tenant/notification")
    }

    const { unreadCount, totalCount, list, total } = myMessage

    return (
        <>
            <div className="mainActionBox">
                <Button variant="contained" onClick={goNotification}>
                    通知设置
                </Button>
                <Button variant="contained" onClick={toggleConfirm}>
                    全部标为已读
                </Button>
            </div>
            <h1>站内信</h1>
            <p>
                共 {totalCount} 封消息，其中 {unreadCount} 封未读
            </p>
            <div className={selectBar.root}>
                <FormControl>
                    <Input
                        name="keyword"
                        onChange={onChange}
                        value={keyword}
                        startAdornment={<InputAdornment position="start">搜索</InputAdornment>}
                        placeholder="消息标题"
                    />
                </FormControl>
                <Button
                    color="primary"
                    variant="contained"
                    className="small"
                    startIcon={<span className="material-icons">search</span>}
                    onClick={onSearch}
                >
                    查 询
                </Button>
            </div>
            <MessageTable
                list={list}
                loading={loading}
                current={current}
                pageSize={pageSize}
                total={total}
                onPaginationChange={onPaginationChange}
                onDelete={initData}
            />
            <Dialog open={confirmOpen} onClose={toggleConfirm}>
                <DialogTitle>
                    确定
                    <DialogClose onClose={toggleConfirm} />
                </DialogTitle>
                <DialogContent>
                    <p style={{ margin: 0, minWidth: 400 }}>确定全部标为已读？</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleConfirm}>取 消</Button>
                    <Button onClick={markReadAll} color="secondary">
                        确 定
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
