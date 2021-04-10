import React, { PureComponent } from "react";
import http from "my/http";
import AssignDialog from "./AssignDialog";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import tipBox from "components/TipBox.module.css";
import styles from "./index.module.css";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import MyTable from "components/MyTable";

function DeleteDialog({ open, onDelete, onCancel }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                移除角色
                <DialogClose onClose={onCancel} />
            </DialogTitle>
            <DialogContent>
                <p style={{ margin: 0, minWidth: 400 }}>
                    移除后用户立即失去该角色赋予的权限，确定移除？
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取 消</Button>
                <Button onClick={onDelete} color="secondary">
                    移 除
                </Button>
            </DialogActions>
        </Dialog>
    );
}

class Role extends PureComponent {
    state = {
        list: [],
        loading: true,
        assignOpen: false,
        deleteOpen: false,
        deleteId: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { match } = this.props;
        const params = { userId: match.params.id };
        const list = await http.get("roles/by-user", { params });

        this.setState({ list, loading: false });
    };

    openAssign = () => {
        this.setState({ assignOpen: true });
    };

    closeAssign = () => {
        this.setState({ assignOpen: false });
        this.initData();
    };

    openDelete = deleteId => {
        this.setState({ deleteOpen: true, deleteId });
    };

    closeDelete = () => {
        this.setState({ deleteOpen: false });
    };

    onDelete = async () => {
        const { deleteId } = this.state;
        const { match } = this.props;

        await http.delete(`users/${match.params.id}/roles`, { params: { roleId: deleteId } });
        eventEmitter.emit("app/openToast", { text: "移除成功", timeout: 2000 });
        this.initData();
        this.closeDelete();
    };

    onAssign = async (roleId, clientId) => {
        const { match } = this.props;

        const params = { roleId, clientId };
        await http.post(`users/${match.params.id}/roles`, params);

        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    render() {
        const { list, loading, assignOpen, deleteOpen } = this.state;

        return (
            <>
                <div className="actionBox">
                    <Button variant="contained" color="primary" onClick={this.openAssign}>
                        分配角色
                    </Button>
                </div>
                <p style={{ marginTop: 30 }}>这些是分配给这个用户的所有角色。</p>
                <MyTable length={list.length} loading={loading} className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>所属应用</TableCell>
                            <TableCell>分配时间</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell className={styles.name}>{item.name}</TableCell>
                                <TableCell className={styles.description}>
                                    {item.description || "-"}
                                </TableCell>
                                <TableCell className={styles.clientName}>
                                    {item.clientName}
                                </TableCell>
                                <TableCell>
                                    {moment(item.linkDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => this.openDelete(item.id)}>
                                        <span className="material-icons">delete</span>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            给用户分配角色和为角色关联用户虽然叫法不同，但实际是同一个动作，都让用户拥有对应角色赋予的权限。
                        </li>
                    </ol>
                </div>
                <AssignDialog
                    open={assignOpen}
                    onClose={this.closeAssign}
                    onAssign={this.onAssign}
                />
                <DeleteDialog
                    open={deleteOpen}
                    onDelete={this.onDelete}
                    onCancel={this.closeDelete}
                />
            </>
        );
    }
}

export default withRouter(Role);
