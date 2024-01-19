import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./UserTable.module.css";
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
} from "@material-ui/core";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import MyTable from "components/MyTable";
import GenderSymbol from "components/GenderSymbol";

class UserTable extends PureComponent {
    state = {
        id: null,
        anchorEl: null
    };

    openMenu = (event, id) => {
        this.setState({ anchorEl: event.currentTarget, id });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    go = (tab) => {
        const { history, match, dispatch } = this.props;
        const { id } = this.state;

        dispatch({ type: "user", currentTab: tab });
        history.push(`${match.url}/${id}`);
    };

    onClick = (event, id) => {
        event.preventDefault();
        this.setState({ id }, () => this.go("basic"));
    };

    render() {
        const { list, loading, current, pageSize, total, onPaginationChange, orderBy } = this.props;
        const { anchorEl } = this.state;
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
                                        onClick={(event) => this.onClick(event, item.id)}
                                    >
                                        <img src={item.avatarUrl} alt="avatar" />
                                        {item.nickname}
                                    </Link>
                                </TableCell>
                                <TableCell>{item.mobile || "-"}</TableCell>
                                <TableCell>{item.email || "-"}</TableCell>
                                <TableCell>
                                    <GenderSymbol gender={item.gender} dense />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={(event) => this.openMenu(event, item.id)}>
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
                    onClose={this.closeMenu}
                    autoFocus={false}
                    className={styles.dropDown}
                >
                    <MenuItem onClick={() => this.go("basic")}>
                        <ListItemText>账号详情</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("json")}>
                        <ListItemText>预览 JSON</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("client")}>
                        <ListItemText>授权应用</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("danger")}>
                        <ListItemText>危险设置</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }
}

export default connect()(withRouter(UserTable));
