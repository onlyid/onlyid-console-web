import React, { PureComponent } from "react";
import { Button, Drawer, IconButton } from "@material-ui/core";
import http from "my/http";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import styles from "./MessageBox.module.css";
import { eventEmitter } from "my/utils";
import { withRouter } from "react-router-dom";
import { Close as CloseIcon } from "@material-ui/icons";
import Empty from "components/Empty";

class Item extends PureComponent {
    onClick = event => {
        event.stopPropagation();

        const { markRead } = this.props;
        markRead();
    };

    render() {
        const { message, markRead, ...restProps } = this.props;

        return (
            <div className={styles.item} {...restProps}>
                <div className={styles.box1}>
                    {message.important ? (
                        <span className="material-icons" style={{ color: "#f44336" }}>
                            flag
                        </span>
                    ) : (
                        <span className="material-icons" style={{ color: "#2196f3" }}>
                            info_outline
                        </span>
                    )}
                    <span className={styles.createDate}>
                        {moment(message.createDate).format(DATE_TIME_FORMAT)}
                    </span>
                    <Button
                        className={styles.markRead}
                        size="small"
                        onClick={this.onClick}
                        color="primary"
                    >
                        标记已读
                    </Button>
                </div>
                <p className={styles.itemTitle}>{message.title}</p>
            </div>
        );
    }
}

class List extends PureComponent {
    state = {
        showEmpty: false,
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const list = await http.get("my-messages/unread");
        this.setState({ list, showEmpty: !list.length });
    };

    markRead = async id => {
        await http.put(`my-messages/${id}/mark-read`);
        this.initData();
        eventEmitter.emit("myMessage/countChange");
    };

    render() {
        const { showEmpty, list } = this.state;
        const { onItemClick } = this.props;

        if (showEmpty)
            return (
                <div className="emptyBox">
                    <Empty description="暂无未读消息" />
                </div>
            );

        return (
            <div className={styles.list}>
                {list.map(item => (
                    <Item
                        message={item}
                        key={item.id}
                        markRead={() => this.markRead(item.id)}
                        onClick={() => onItemClick(item.id)}
                    />
                ))}
            </div>
        );
    }
}

class MessageBox extends PureComponent {
    goMessageHome = () => {
        const { history, onClose } = this.props;

        history.push("/my-messages");
        onClose();
    };

    onItemClick = id => {
        const { history, onClose } = this.props;

        history.push(`/my-messages/${id}`);
        onClose();
    };

    render() {
        const { visible, onClose } = this.props;

        const drawerTitle = (
            <div className={styles.drawerTitle}>
                <h2>站内信</h2>
                <div style={{ marginRight: 40 }}>
                    <Button onClick={this.goMessageHome} color="primary">
                        查看更多
                    </Button>
                </div>
                <IconButton className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
        );

        return (
            <Drawer anchor="right" open={visible} onClose={onClose}>
                {drawerTitle}
                <List onItemClick={id => this.onItemClick(id)} />
            </Drawer>
        );
    }
}

export default withRouter(MessageBox);
