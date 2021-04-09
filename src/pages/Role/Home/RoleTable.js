import React, { PureComponent } from "react";
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
import styles from "./RoleTable.module.css";
import { DATE_TIME_FORMAT } from "my/constants";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MyTable from "components/MyTable";

class RoleTable extends PureComponent {
    state = {
        roleId: null,
        anchorEl: null
    };

    openMenu = (event, roleId) => {
        this.setState({ anchorEl: event.currentTarget, roleId });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    go = tab => {
        const { history, match, dispatch } = this.props;
        const { roleId } = this.state;

        dispatch({ type: "role", currentTab: tab });
        history.push(`${match.url}/${roleId}`);
    };

    onClick = (event, roleId) => {
        event.preventDefault();
        this.setState({ roleId }, () => this.go("basic"));
    };

    render() {
        const { list, loading } = this.props;
        const { anchorEl } = this.state;

        return (
            <>
                <MyTable length={list.length} loading={loading} className={styles.root}>
                    <TableHead>
                        <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell style={{ width: 200 }}>创建时间</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell>
                                    <Link href="#" onClick={event => this.onClick(event, item.id)}>
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell className={styles.description}>
                                    {item.description}
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
                    open={Boolean(anchorEl)}
                    onClose={this.closeMenu}
                    autoFocus={false}
                    className={styles.dropDown}
                >
                    <MenuItem onClick={() => this.go("basic")}>
                        <ListItemText>角色详情</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("permission")}>
                        <ListItemText>分配权限</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("user")}>
                        <ListItemText>关联用户</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("danger")}>
                        <ListItemText>危险设置</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }
}

export default connect()(withRouter(RoleTable));
