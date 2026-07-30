import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { useHistory, useRouteMatch } from "react-router-dom"
import styles from "./UserTable.module.css"
import {
    IconButton,
    Link,
    ListItemText,
    Menu,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core"
import moment from "moment"
import { DATE_TIME_FORMAT } from "my/constants"
import MyTable from "components/MyTable"
import GenderSymbol from "components/GenderSymbol"

export default function UserTable({
    list,
    loading,
    current,
    pageSize,
    total,
    onPaginationChange,
    orderBy
}) {
    const idRef = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)
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

    const go = (tab) => {
        dispatch({ type: "user", currentTab: tab })
        history.push(`${match.url}/${idRef.current}`)
    }

    const onClick = (event, id) => {
        event.preventDefault()
        idRef.current = id
        go("basic")
    }

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
                        <TableCell>用户</TableCell>
                        <TableCell>手机号</TableCell>
                        <TableCell>邮箱</TableCell>
                        <TableCell>性别</TableCell>
                        <TableCell align="center">操作</TableCell>
                        <TableCell className={styles.borderLeft}>登录应用</TableCell>
                        <TableCell>登录时间</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item, index) => (
                        <TableRow key={index} hover>
                            <TableCell>
                                <Link
                                    className={styles.userBox}
                                    href="#"
                                    onClick={(event) => onClick(event, item.id)}
                                >
                                    <img src={item.avatar} alt="avatar" />
                                    {item.nickname}
                                </Link>
                            </TableCell>
                            <TableCell>{item.mobile || "-"}</TableCell>
                            <TableCell>{item.email || "-"}</TableCell>
                            <TableCell>
                                <GenderSymbol gender={item.gender} dense />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={(event) => openMenu(event, item.id)}>
                                    <span className="material-icons">more_horiz</span>
                                </IconButton>
                            </TableCell>
                            <TableCell className={styles.borderLeft}>
                                <div className={styles.clientBox}>
                                    <img src={item.clientIconUrl} alt="icon" />
                                    {item.clientName}
                                </div>
                            </TableCell>
                            <TableCell>
                                {orderBy === "firstDate"
                                    ? moment(item.firstDate).format(DATE_TIME_FORMAT)
                                    : moment(item.lastDate).format(DATE_TIME_FORMAT)}
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
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                autoFocus={false}
                className={styles.dropDown}
            >
                <MenuItem onClick={() => go("basic")}>
                    <ListItemText>账号详情</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => go("json")}>
                    <ListItemText>预览 JSON</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => go("client")}>
                    <ListItemText>授权应用</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => go("danger")}>
                    <ListItemText>危险设置</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
