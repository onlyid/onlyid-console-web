import React, { PureComponent } from "react";
import http from "my/http";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import styles from "./index.module.css";
import { withRouter } from "react-router-dom";
import ClientSelect from "components/ClientSelect";
import MyTable from "components/MyTable";

class AssignDialog extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        clientId: "all"
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const { current, pageSize, clientId } = this.state;

        const params = { current, pageSize };
        if (clientId !== "all") params.clientId = clientId;

        const { list, total } = await http.get("roles", { params });
        this.setState({ list, total, loading: false });
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    onSearch = () => {
        this.setState({ current: 1 }, this.initData);
    };

    onClientChange = clientId => {
        this.setState({ clientId });
    };

    render() {
        const { list, current, pageSize, total, loading, clientId } = this.state;
        const { open, onClose, onAssign } = this.props;

        const pagination = { current, pageSize, total };

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    分配角色
                    <DialogClose onClose={onClose} />
                </DialogTitle>
                <DialogContent className={styles.dialog}>
                    <div>
                        <ClientSelect value={clientId} onChange={this.onClientChange} />
                        <Button
                            color="primary"
                            variant="contained"
                            className="small"
                            startIcon={<span className="material-icons">search</span>}
                            onClick={this.onSearch}
                            style={{ marginLeft: 35 }}
                        >
                            查 询
                        </Button>
                    </div>
                    <MyTable
                        length={list.length}
                        loading={loading}
                        className={styles.table1}
                        pagination={pagination}
                        onPaginationChange={this.onPaginationChange}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>名称</TableCell>
                                <TableCell>描述</TableCell>
                                <TableCell>所属应用</TableCell>
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
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => onAssign(item.id, item.clientId)}
                                        >
                                            <span className="material-icons">add</span>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </MyTable>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withRouter(AssignDialog);
