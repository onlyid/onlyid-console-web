import { useState, useEffect } from "react"
import { AppBar, Badge, IconButton, Toolbar, Tooltip } from "@mui/material"
import Logo from "@/assets/logo.svg?react"
import styles from "./Header.module.css"
import HelpIcon from "@mui/icons-material/Help"
import NotificationsIcon from "@mui/icons-material/Notifications"
import RightAccount from "./RightAccount"
import HelpDialog from "./HelpDialog"
import MessageBox from "./MessageBox"
import { eventEmitter } from "@/my/utils"
import request from "@/my/request"
import { useDispatch, useSelector } from "react-redux"

function Header() {
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [dialogVisible, setDialogVisible] = useState(false)
    const myMessage = useSelector((state) => state.myMessage)
    const dispatch = useDispatch()

    const { unreadCount } = myMessage

    const getMessageCount = async () => {
        const { unreadCount, totalCount } = await request.get("my-messages/count")
        dispatch({ type: "myMessage", unreadCount, totalCount })
    }

    useEffect(() => {
        // 如果还在登录中，直接请求会报401，所以推迟一点
        setTimeout(getMessageCount, 2000)

        eventEmitter.on("myMessage/countChange", getMessageCount)

        return () => {
            eventEmitter.off("myMessage/countChange", getMessageCount)
        }
    }, [])

    const showDrawer = () => {
        setDrawerVisible(true)
    }

    const closeDrawer = () => {
        setDrawerVisible(false)
    }

    const showDialog = () => {
        setDialogVisible(true)
    }

    const closeDialog = () => {
        setDialogVisible(false)
    }

    return (
        <AppBar className={styles.root}>
            <Toolbar variant="dense" className={styles.toolbar}>
                <Tooltip title="打开官网">
                    <a href="https://onlyid.net/web" target="_blank" rel="noopener noreferrer">
                        <Logo style={{ fill: "#fff", width: 75, verticalAlign: "middle" }} />
                    </a>
                </Tooltip>
                <div className={styles.rightBox}>
                    <IconButton
                        color="inherit"
                        className={styles.iconButton}
                        onClick={showDialog}
                        style={{ marginRight: 8 }}
                    >
                        <HelpIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        className={styles.iconButton}
                        onClick={showDrawer}
                        style={{ marginRight: 4 }}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <RightAccount />
                </div>
            </Toolbar>
            <HelpDialog onClose={closeDialog} visible={dialogVisible} />
            <MessageBox onClose={closeDrawer} visible={drawerVisible} />
        </AppBar>
    )
}

export default Header
