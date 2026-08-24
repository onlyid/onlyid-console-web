import { useEffect, useState } from "react"
import request from "@/my/request"
import { eventEmitter } from "@/my/utils"
import MainHeader from "@/components/MainHeader"
import { useHistory, useRouteMatch } from "react-router-dom"
import LevelSymbol from "@/components/LevelSymbol"
import moment from "moment"
import { DATE_TIME_FORMAT } from "@/my/constants"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material"
import styles from "./index.module.css"
import Delete from "@mui/icons-material/Delete"
import DialogClose from "@/components/DialogClose"
import { useSelector } from "react-redux"

export default function Index() {
    const [message, setMessage] = useState({ html: "" })
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [prevId, setPrevId] = useState(null)
    const [nextId, setNextId] = useState(null)

    const history = useHistory()
    const match = useRouteMatch()
    const myMessage = useSelector((state) => state.myMessage)

    const { id: currentId } = match.params

    const initData = async () => {
        const message = await request.get(`my-messages/${currentId}`)
        setMessage(message)

        const params = { keyword: myMessage.keyword }
        const data = await request.get(`my-messages/${currentId}/adjacent`, {
            params
        })
        const { prevId, nextId } = data
        setPrevId(prevId)
        setNextId(nextId)

        if (!message.isRead) {
            await request.put(`my-messages/${currentId}/mark-read`)
            eventEmitter.emit("myMessage/countChange")
        }
    }

    useEffect(() => {
        initData()
    }, [currentId])

    const toggleDelete = () => {
        setDeleteOpen((value) => !value)
    }

    const submitDelete = async () => {
        await request.delete("my-messages/" + currentId)
        eventEmitter.emit("myMessage/countChange")
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 })

        history.goBack()
    }

    const go = (type) => {
        const id = type === "prev" ? prevId : nextId
        history.replace("/my-messages/" + id)
    }

    const userInfo = localStorage.getObj("userInfo")

    const html = message.html
        .replace("#nickname#", userInfo.nickname)
        .replace(/<h1[\s\S]+<\/h1>/, "")

    return (
        <>
            <div className="mainActionBox">
                <Button
                    variant="outlined"
                    disabled={!prevId}
                    onClick={() => go("prev")}
                    className="small"
                >
                    上一封
                </Button>
                <Button
                    variant="outlined"
                    disabled={!nextId}
                    onClick={() => go("next")}
                    className="small"
                >
                    下一封
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={toggleDelete}
                    className="small"
                >
                    删除
                </Button>
            </div>
            <MainHeader backText="返回上一页" title="">
                <ul>
                    <li>
                        <span>级别：</span>
                        <span>
                            <LevelSymbol important={message.important} />
                        </span>
                    </li>
                    <li>
                        <span>时间：</span>
                        <span>{moment(message.createDate).format(DATE_TIME_FORMAT)}</span>
                    </li>
                </ul>
            </MainHeader>
            <Paper className={styles.content} variant="outlined">
                <h1>{message.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </Paper>
            <Dialog open={deleteOpen} onClose={toggleDelete}>
                <DialogTitle>
                    删除消息
                    <DialogClose onClose={toggleDelete} />
                </DialogTitle>
                <DialogContent>
                    <p style={{ margin: 0, minWidth: 400 }}>删除后不可恢复，确定删除？</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDelete}>取 消</Button>
                    <Button onClick={submitDelete}>删 除</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
