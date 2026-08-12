import { useState, useRef } from "react"
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
import styles from "./ClientTable.module.css"
import { CLIENT_TYPE_TEXT, DATE_TIME_FORMAT } from "@/my/constants"
import moment from "moment"
import { useHistory, useRouteMatch } from "react-router-dom"
import { useDispatch } from "react-redux"
import CopyButton from "@/components/CopyButton"
import MyTable from "@/components/MyTable"

export default function ClientTable({ list, loading }) {
    const clientId = useRef(null)
    const [anchorEl, setAnchorEl] = useState(null)

    const history = useHistory()
    const match = useRouteMatch()
    const dispatch = useDispatch()

    const openMenu = (event, id) => {
        clientId.current = id
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    const go = (tab) => {
        dispatch({ type: "application", currentTab: tab })
        history.push(`${match.url}/${clientId.current}`)
    }

    const onClick = (event, id) => {
        event.preventDefault()
        clientId.current = id
        go("basic")
    }

    return (
        <>
            <MyTable length={list.length} loading={loading} className={styles.root}>
                <TableHead>
                    <TableRow>
                        <TableCell>应用</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>类型</TableCell>
                        <TableCell>创建时间</TableCell>
                        <TableCell align="center">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item) => (
                        <TableRow key={item.id} hover>
                            <TableCell>
                                <Link
                                    className={styles.clientBox}
                                    href="#"
                                    onClick={(event) => onClick(event, item.id)}
                                >
                                    <img src={item.iconUrl} alt="icon" />
                                    {item.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className={styles.clientId}>
                                    {item.id}
                                    <CopyButton value={item.id} />
                                </div>
                            </TableCell>
                            <TableCell style={{ width: 120 }}>
                                {CLIENT_TYPE_TEXT[item.type]}
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
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                autoFocus={false}
                className={styles.dropDown}
            >
                <MenuItem onClick={() => go("basic")}>
                    <ListItemText>应用详情</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => go("oauth")}>
                    <ListItemText>OAuth 设置</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => go("danger")}>
                    <ListItemText>危险设置</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
