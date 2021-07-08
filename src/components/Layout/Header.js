import React, { PureComponent } from "react";
import { AppBar, Badge, IconButton, Toolbar, Tooltip } from "@material-ui/core";
import { ReactComponent as Logo } from "assets/logo.svg";
import styles from "./Header.module.css";
import { Help as HelpIcon, Notifications as NotificationsIcon } from "@material-ui/icons";
import RightAccount from "./RightAccount";
import HelpDialog from "./HelpDialog";
import MessageBox from "./MessageBox";
import { eventEmitter } from "my/utils";
import http from "my/http";
import { connect } from "react-redux";

class Header extends PureComponent {
    state = {
        drawerVisible: false,
        dialogVisible: false,
    };

    componentDidMount() {
        // 如果还在登录中，直接请求会报401，所以推迟一点
        setTimeout(this.getMessageCount, 2000);

        eventEmitter.on("myMessage/countChange", this.getMessageCount);
    }

    getMessageCount = async () => {
        const { dispatch } = this.props;

        const { unreadCount, totalCount } = await http.get("my-messages/count");
        dispatch({ type: "myMessage", unreadCount, totalCount });
    };

    showDrawer = () => {
        this.setState({ drawerVisible: true });
    };

    closeDrawer = () => {
        this.setState({ drawerVisible: false });
    };

    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
    };

    render() {
        const { drawerVisible, dialogVisible } = this.state;
        const {
            myMessage: { unreadCount },
        } = this.props;

        return (
            <AppBar className={styles.root}>
                <Toolbar variant="dense" className={styles.toolbar}>
                    <Tooltip title="打开官网">
                        <a href="https://www.onlyid.net" target="_blank" rel="noopener noreferrer">
                            <Logo style={{ fill: "#fff", width: 75, verticalAlign: "middle" }} />
                        </a>
                    </Tooltip>
                    <div className={styles.rightBox}>
                        <IconButton
                            color="inherit"
                            className={styles.iconButton}
                            onClick={this.showDialog}
                        >
                            <HelpIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            className={styles.iconButton}
                            onClick={this.showDrawer}
                        >
                            <Badge badgeContent={unreadCount} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <RightAccount />
                    </div>
                </Toolbar>
                <HelpDialog onClose={this.closeDialog} visible={dialogVisible} />
                <MessageBox onClose={this.closeDrawer} visible={drawerVisible} />
            </AppBar>
        );
    }
}

export default connect(({ myMessage }) => ({ myMessage }))(Header);
