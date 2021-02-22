import React, { PureComponent } from "react";
import Avatar from "components/Avatar";
import styles from "./index.module.css";
import http from "my/http";
import { eventEmitter } from "my/utils";
import { Link } from "react-router-dom";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";

const HOME_URL = "https://www.onlyid.net/home";

class RightAccount extends PureComponent {
    state = {
        anchorEl: null
    };

    componentDidMount() {
        eventEmitter.on("app/login", () => this.forceUpdate());
    }

    logout = async () => {
        await http.post("logout");

        window.location.replace(HOME_URL);
    };

    openMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const userInfo = localStorage.getObj("userInfo");
        if (!userInfo) return null;

        return (
            <>
                <div className={styles.rightAccount} onClick={this.openMenu}>
                    <Avatar url={userInfo.avatarUrl} width={30} />
                    <span className={styles.accountName}>{userInfo.nickname}</span>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    getContentAnchorEl={null}
                    open={Boolean(anchorEl)}
                    onClose={this.closeMenu}
                    autoFocus={false}
                    className={styles.dropDown}
                    disableScrollLock
                    onClick={this.closeMenu}
                >
                    <MenuItem component={Link} to="/tenant/info">
                        <ListItemIcon>
                            <span className="material-icons">account_circle</span>
                        </ListItemIcon>
                        <ListItemText>租户信息</ListItemText>
                    </MenuItem>
                    <MenuItem component={Link} to="/tenant/renewal">
                        <ListItemIcon>
                            <span className="material-icons">credit_card</span>
                        </ListItemIcon>
                        <ListItemText>有效期和续费</ListItemText>
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
        );
    }
}

export default RightAccount;
