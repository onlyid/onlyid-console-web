import React, { PureComponent } from "react";
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
import { DATE_TIME_FORMAT } from "my/constants";
import moment from "moment";
import MyTable from "components/MyTable";
import styles from "./Table.module.css";
import DialogClose from "components/DialogClose";
import http from "my/http";
import { eventEmitter } from "my/utils";
import EditDialog from "./EditDialog";

function DeleteDialog({ open, onDelete, onCancel, id }) {
    const onSubmit = async () => {
        await http.delete("permissions/" + id);
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 });
        onDelete();
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                删除权限
                <DialogClose onClose={onCancel} />
            </DialogTitle>
            <DialogContent>
                <p style={{ margin: 0, minWidth: 400 }}>删除后不可恢复，确定删除？</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取 消</Button>
                <Button onClick={onSubmit} color="secondary">
                    删 除
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default class extends PureComponent {
    state = {
        deleteOpen: false,
        editOpen: false,
        permission: {}
    };

    openDelete = permission => {
        this.setState({ deleteOpen: true, permission });
    };

    closeDelete = () => {
        this.setState({ deleteOpen: false });
    };

    openEdit = permission => {
        this.setState({ editOpen: true, permission });
    };

    closeEdit = () => {
        this.setState({ editOpen: false });
    };

    render() {
        const { deleteOpen, editOpen, permission } = this.state;
        const { list, loading, onChange } = this.props;

        return (
            <>
                <h2>权限列表</h2>
                <p>这些是应用需要使用的所有权限。</p>
                <MyTable length={list.length} loading={loading} className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell>资源</TableCell>
                            <TableCell>操作</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell style={{ width: 200 }}>创建时间</TableCell>
                            <TableCell style={{ width: 150 }} align="center">
                                操作
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.resource}</span>
                                </TableCell>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.operation || "-"}</span>
                                </TableCell>
                                <TableCell className={styles.description}>
                                    {item.description || "-"}
                                </TableCell>
                                <TableCell>
                                    {moment(item.createDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => this.openEdit(item)}>
                                        <span className="material-icons">edit</span>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => this.openDelete(item)}
                                        style={{ marginLeft: 5 }}
                                    >
                                        <span className="material-icons">delete</span>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
                <DeleteDialog
                    open={deleteOpen}
                    onDelete={() => {
                        onChange();
                        this.closeDelete();
                    }}
                    onCancel={this.closeDelete}
                    id={permission.id}
                />
                <EditDialog
                    open={editOpen}
                    onSave={() => {
                        onChange();
                        this.closeEdit();
                    }}
                    onCancel={this.closeEdit}
                    permission={permission}
                    key={Date()}
                />
            </>
        );
    }
}
