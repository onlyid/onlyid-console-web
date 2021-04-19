import React, { PureComponent } from "react";
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
} from "@material-ui/core";
import styles from "./MessageTable.module.css";
import http from "my/http";
import classNames from "classnames";
import { eventEmitter } from "my/utils";
import MyTable from "components/MyTable";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import DialogClose from "components/DialogClose";
import LevelSymbol from "../LevelSymbol";

class MessageTable extends PureComponent {
    state = {
        anchorEl: null,
        id: null,
        deleteOpen: false
    };

    openMenu = (event, id) => {
        this.setState({ anchorEl: event.currentTarget, id });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    markRead = async () => {
        const { list } = this.props;
        const { id } = this.state;

        await http.put(`my-messages/${id}/mark-read`);
        eventEmitter.emit("myMessage/countChange");

        list.find(item => item.id === id).isRead = true;
        this.forceUpdate();
    };

    toggleDelete = () => {
        this.setState(({ deleteOpen }) => ({ deleteOpen: !deleteOpen }));
    };

    submitDelete = async () => {
        const { id } = this.state;
        const { onDelete } = this.props;

        await http.delete("my-messages/" + id);
        eventEmitter.emit("myMessage/countChange");
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 });
        this.toggleDelete();
        onDelete();
    };

    go = () => {
        const { history, match } = this.props;
        const { id } = this.state;

        history.push(`${match.url}/${id}`);
    };

    onClick = (event, id) => {
        event.preventDefault();
        this.setState({ id }, this.go);
    };

    render() {
        const { anchorEl, deleteOpen } = this.state;
        const { list, current, pageSize, total, loading, onPaginationChange } = this.props;
        const userInfo = localStorage.getObj("userInfo");

        const pagination = { current, pageSize, total };

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
                        {list.map(item => (
                            <TableRow
                                key={item.id}
                                hover
                                className={classNames({ [styles.isRead]: item.isRead })}
                            >
                                <TableCell className={styles.title}>
                                    <Link href="#" onClick={event => this.onClick(event, item.id)}>
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
                                    <IconButton onClick={event => this.openMenu(event, item.id)}>
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
                    onClose={this.closeMenu}
                    autoFocus={false}
                    className={styles.dropDown}
                    onClick={this.closeMenu}
                >
                    <MenuItem onClick={this.go}>
                        <ListItemText>消息详情</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={this.markRead}>
                        <ListItemText>标记已读</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={this.toggleDelete}>
                        <ListItemText>删除消息</ListItemText>
                    </MenuItem>
                </Menu>
                <Dialog open={deleteOpen} onClose={this.toggleDelete}>
                    <DialogTitle>
                        删除消息
                        <DialogClose onClose={this.toggleDelete} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, minWidth: 400 }}>删除后不可恢复，确定删除？</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleDelete}>取 消</Button>
                        <Button onClick={this.submitDelete} color="secondary">
                            删 除
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withRouter(MessageTable);
