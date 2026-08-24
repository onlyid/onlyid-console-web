import { useRef, useState } from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    ListItemText,
    Menu,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material"
import styles from "./MessageTable.module.css"
import request from "@/my/request"
import classNames from "classnames"
import { eventEmitter } from "@/my/utils"
import MyTable from "@/components/MyTable"
import { useHistory, useRouteMatch } from "react-router-dom"
import moment from "moment"
import { DATE_TIME_FORMAT } from "@/my/constants"
import DialogClose from "@/components/DialogClose"
import LevelSymbol from "@/components/LevelSymbol"
import { useDispatch } from "react-redux"

export default function MessageTable({
    list,
    current,
    pageSize,
    total,
    loading,
    onPaginationChange,
    onDelete
}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const idRef = useRef(null)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const history = useHistory()
    const match = useRouteMatch()
    const dispatch = useDispatch()

    const openMenu = (event, id) => {
        idRef.current = id
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    const markRead = async () => {
        await request.put(`my-messages/${idRef.current}/mark-read`)
        eventEmitter.emit("myMessage/countChange")

        const newList = list.map((item) =>
            item.id === idRef.current ? { ...item, isRead: true } : item
        )
        dispatch({ type: "myMessage", list: newList })
    }

    const toggleDelete = () => {
        setDeleteOpen((value) => !value)
    }

    const submitDelete = async () => {
        await request.delete("my-messages/" + idRef.current)
        eventEmitter.emit("myMessage/countChange")
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 })
        toggleDelete()
        onDelete()
    }

    const go = () => {
        history.push(`${match.url}/${idRef.current}`)
    }

    const onClick = (event, currentId) => {
        event.preventDefault()
        idRef.current = currentId
        go()
    }

    const userInfo = localStorage.getObj("userInfo")
    const pagination = { current, pageSize, total }

    return (
        <>
            <MyTable
                className={styles.table1}
                length={list.length}
                loading={loading}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>标题</TableCell>
                        <TableCell>内容</TableCell>
                        <TableCell>级别</TableCell>
                        <TableCell>时间</TableCell>
                        <TableCell align="center">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item) => (
                        <TableRow
                            key={item.id}
                            hover
                            className={classNames({ [styles.isRead]: item.isRead })}
                        >
                            <TableCell className={styles.title}>
                                <Link href="#" onClick={(event) => onClick(event, item.id)}>
                                    {item.title}
                                </Link>
                            </TableCell>
                            <TableCell className={styles.content}>
                                {/* 替换nickname 去掉标题 把所有的html标签移除 */}
                                {item.html
                                    .replace("#nickname#", userInfo.nickname)
                                    .replace(/<h1[\s\S]+<\/h1>/, "")
                                    .replace(/<[\s\S]+?>/g, " ")}
                            </TableCell>
                            <TableCell>
                                <LevelSymbol important={item.important} />
                            </TableCell>
                            <TableCell>
                                {moment(item.createDate).format(DATE_TIME_FORMAT)}
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={(event) => openMenu(event, item.id)}>
                                    <span className="material-icons">more_horiz</span>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MyTable>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                getContentAnchorEl={null}
                open={!!anchorEl}
                onClose={closeMenu}
                autoFocus={false}
                className={styles.dropDown}
                onClick={closeMenu}
            >
                <MenuItem onClick={go}>
                    <ListItemText>消息详情</ListItemText>
                </MenuItem>
                <MenuItem onClick={markRead}>
                    <ListItemText>标记已读</ListItemText>
                </MenuItem>
                <MenuItem onClick={toggleDelete}>
                    <ListItemText>删除消息</ListItemText>
                </MenuItem>
            </Menu>
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
