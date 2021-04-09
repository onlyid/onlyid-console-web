import React, { PureComponent } from "react";
import http from "my/http";
import LinkDialog from "./LinkDialog";
import { withRouter } from "react-router-dom";
import { eventEmitter } from "my/utils";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import Table from "./Table";

function DeleteDialog({ open, onDelete, onCancel }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                移除用户
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

class User extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        linkOpen: false,
        deleteId: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize } = this.state;
        const { match } = this.props;

        const params = { current, pageSize, roleId: match.params.id };
        const { list, total } = await http.get("users/by-role", { params });

        this.setState({ list, total, loading: false });
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    openLink = () => {
        this.setState({ linkOpen: true });
    };

    closeLink = () => {
        this.setState({ linkOpen: false });
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

        await http.delete(`users/${deleteId}/roles`, { params: { roleId: match.params.id } });
        eventEmitter.emit("app/openToast", { text: "移除成功", timeout: 2000 });
        this.initData();
        this.closeDelete();
    };

    render() {
        const { list, current, pageSize, total, loading, linkOpen, deleteOpen } = this.state;

        return (
            <>
                <div className="actionBox">
                    <Button variant="contained" color="primary" onClick={this.openLink}>
                        关联用户
                    </Button>
                </div>
                <p style={{ marginTop: 30 }}>这些是关联了这个角色的所有用户。</p>
                <Table
                    list={list}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    loading={loading}
                    onPaginationChange={this.onPaginationChange}
                    action={id => (
                        <IconButton onClick={() => this.openDelete(id)}>
                            <span className="material-icons">delete</span>
                        </IconButton>
                    )}
                />
                <LinkDialog open={linkOpen} onClose={this.closeLink} />
                <DeleteDialog
                    open={deleteOpen}
                    onDelete={this.onDelete}
                    onCancel={this.closeDelete}
                />
            </>
        );
    }
}

export default withRouter(User);
