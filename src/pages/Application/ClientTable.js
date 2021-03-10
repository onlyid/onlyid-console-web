import React, { PureComponent } from "react";
import {
    IconButton,
    Link,
    ListItemText,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import styles from "./ClientTable.module.css";
import { CLIENT_TYPE_TEXT, DATE_TIME_FORMAT } from "my/constants";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CopyButton from "components/CopyButton";

class ClientTable extends PureComponent {
    state = {
        clientId: null,
        anchorEl: null
    };

    openMenu = (event, clientId) => {
        this.setState({ anchorEl: event.currentTarget, clientId });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    go = tab => {
        const { history, match, dispatch } = this.props;
        const { clientId } = this.state;

        dispatch({ type: "application", payload: { currentTab: tab } });
        history.push(`${match.url}/${clientId}`);
    };

    onClick = (event, clientId) => {
        event.preventDefault();
        this.setState({ clientId }, () => this.go("basic"));
    };

    render() {
        const { list } = this.props;
        const { anchorEl } = this.state;

        return (
            <>
                <Table className={styles.root}>
                    <TableHead>
                        <TableRow>
                            <TableCell>应用</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>类型</TableCell>
                            <TableCell>创建时间</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Link
                                        className={styles.clientBox}
                                        href="#"
                                        onClick={event => this.onClick(event, item.id)}
                                    >
                                        <img src={item.iconUrl} alt="icon" />
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.clientId}>
                                        {item.id}
                                        <CopyButton value={item.id} />
                                    </div>
                                </TableCell>
                                <TableCell style={{ width: 120 }}>
                                    {CLIENT_TYPE_TEXT[item.type]}
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
                </Table>
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
                    <MenuItem onClick={() => this.go("otp")}>
                        <ListItemText>OTP 验证码设置</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("oauth")}>
                        <ListItemText>SSO OAuth 设置</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.go("danger")}>
                        <ListItemText>危险设置</ListItemText>
                    </MenuItem>
                </Menu>
            </>
        );
    }
}

export default connect()(withRouter(ClientTable));
