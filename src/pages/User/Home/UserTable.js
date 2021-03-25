import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./index.module.css";
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
import { DATE_TIME_FORMAT, GENDER_TEXT } from "my/constants";
import MyTable from "components/MyTable";
import Avatar from "components/Avatar";

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

    go = tab => {
        const { history, match, dispatch } = this.props;
        const { id } = this.state;

        dispatch({ type: "user", payload: { currentTab: tab } });
        history.push(`${match.url}/${id}`);
    };

    onClick = (event, id) => {
        event.preventDefault();
        this.setState({ id }, () => this.go("basic"));
    };

    tableBody = item => {
        const { type } = this.props;

        if (type === "sso")
            return (
                <>
                    <TableCell className={styles.borderLeft}>
                        <div className={styles.clientBox}>
                            <img src={item.clientIconUrl} alt="icon" />
                            {item.clientName}
                        </div>
                    </TableCell>
                    <TableCell>{moment(item.loginDate).format(DATE_TIME_FORMAT)}</TableCell>
                </>
            );

        if (type === "import")
            return (
                <>
                    <TableCell className={styles.borderLeft}>
                        {moment(item.importDate).format(DATE_TIME_FORMAT)}
                    </TableCell>
                    <TableCell>
                        {item.activated ? (
                            <span style={{ color: "#4caf50" }}>已激活</span>
                        ) : (
                            <span style={{ color: "#ff9800" }}>未激活</span>
                        )}
                    </TableCell>
                </>
            );

        return (
            <>
                <TableCell className={styles.borderLeft}>
                    {moment(item.addDate).format(DATE_TIME_FORMAT)}
                </TableCell>
                {item.expireDate ? (
                    <TableCell>
                        {moment(item.expireDate).format(DATE_TIME_FORMAT)}
                        <br />
                        剩余{" "}
                        <span style={{ color: "#f50057" }}>
                            {moment(item.expireDate).diff(moment(), "days")}
                        </span>{" "}
                        天{" "}
                    </TableCell>
                ) : (
                    <TableCell>-</TableCell>
                )}
            </>
        );
    };

    render() {
        const { type, list, loading, current, pageSize, total, onPaginationChange } = this.props;
        const { anchorEl } = this.state;
        const pagination = { current, pageSize, total };

        let tableHead;
        if (type === "sso")
            tableHead = (
                <>
                    <TableCell className={styles.borderLeft}>登录应用</TableCell>
                    <TableCell>登录时间</TableCell>
                </>
            );
        else if (type === "import")
            tableHead = (
                <>
                    <TableCell className={styles.borderLeft}>创建时间</TableCell>
                    <TableCell>激活状态</TableCell>
                </>
            );
        else {
            tableHead = (
                <>
                    <TableCell className={styles.borderLeft}>添加时间</TableCell>
                    <TableCell>移出时间</TableCell>
                </>
            );
        }

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
                            {tableHead}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link
                                        className={styles.userBox}
                                        href="#"
                                        onClick={event => this.onClick(event, item.id)}
                                    >
                                        <Avatar
                                            url={item.avatarUrl}
                                            width={40}
                                            height={40}
                                            style={{ marginRight: 15 }}
                                        />
                                        {item.nickname}
                                    </Link>
                                </TableCell>
                                <TableCell>{item.mobile || "-"}</TableCell>
                                <TableCell>{item.email || "-"}</TableCell>
                                <TableCell>{GENDER_TEXT[item.gender] || "-"}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={event => this.openMenu(event, item.id)}>
                                        <span className="material-icons">more_horiz</span>
                                    </IconButton>
                                </TableCell>
                                {this.tableBody(item)}
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
                        <ListItemText>基础设置</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }
}

export default connect()(withRouter(UserTable));
