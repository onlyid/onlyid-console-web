import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Button, message as antMessage } from "antd";
import styles from "./index.module.css";
import Inbox from "./Inbox";
import Content from "./Content";
import { connect } from "react-redux";
import http from "my/http";
import { eventEmitter } from "my/utils";

class Message extends PureComponent {
    markReadAll = async () => {
        await http.put("messages/mark-read-all");
        antMessage.success("全部标为已读成功");
        eventEmitter.emit("message/onMarkRead");
    };

    render() {
        const {
            message: { unreadCount, total }
        } = this.props;

        const headerLeft = document.getElementById("headerLeft");
        const headerRight = document.getElementById("headerRight");

        const count = (
            <p style={{ marginBottom: 0, marginLeft: -10, marginTop: 2 }}>
                （共{total}封，其中{unreadCount}封未读）
            </p>
        );

        const actions = <Button onClick={this.markReadAll}>全部标为已读</Button>;

        return (
            <div className={styles.root}>
                {headerLeft && ReactDOM.createPortal(count, headerLeft)}
                {headerRight && ReactDOM.createPortal(actions, headerRight)}
                <div>
                    <Inbox />
                </div>
                <div>
                    <Content />
                </div>
            </div>
        );
    }
}

export default connect(({ message }) => ({ message }))(Message);
