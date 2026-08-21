import { PureComponent } from "react"
import styles from "./RightAccount.module.css"
import request from "@/my/request"
import { eventEmitter } from "@/my/utils"
import { Link } from "react-router-dom"
import { ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"

const HOME_URL = "https://onlyid.net/web"

class RightAccount extends PureComponent {
    state = {
        anchorEl: null
    }

    componentDidMount() {
        eventEmitter.on("app/login", () => this.forceUpdate())
    }

    logout = async () => {
        await request.post("logout")

        window.location.replace(HOME_URL)
    }

    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    closeMenu = () => {
        this.setState({ anchorEl: null })
    }

    render() {
        const { anchorEl } = this.state
        const userInfo = localStorage.getObj("userInfo")
        if (!userInfo) return null

        return (
            <>
                <ButtonBase className={styles.root} onClick={this.openMenu}>
                    <img src={userInfo.avatar} alt="avatar" />
                    <span className={styles.nickname}>{userInfo.nickname}</span>
                </ButtonBase>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={this.closeMenu}
                    onClick={this.closeMenu}
                    autoFocus={false}
                    className={styles.dropDown}
                    disableScrollLock
                >
                    <MenuItem component={Link} to="/tenant/info">
                        <ListItemIcon>
                            <span className="material-icons">account_circle</span>
                        </ListItemIcon>
                        <ListItemText>租户信息</ListItemText>
                    </MenuItem>
                    <MenuItem component={Link} to="/tenant/renewal">
                        <ListItemIcon>
                            <span className="iconfont" style={{ fontSize: 18 }}>
                                &#xe650;
                            </span>
                        </ListItemIcon>
                        <ListItemText>订阅续费</ListItemText>
                    </MenuItem>
                    <MenuItem component={Link} to="/tenant/notification">
                        <ListItemIcon>
                            <span className="material-icons">notifications</span>
                        </ListItemIcon>
                        <ListItemText>通知设置</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={this.logout}>
                        <ListItemIcon>
                            <span className="material-icons">logout</span>
                        </ListItemIcon>
                        <ListItemText>退出登录</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        )
    }
}

export default RightAccount
