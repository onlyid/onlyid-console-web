import React, { PureComponent } from "react";
import http from "my/http";
import styles from "./ClientSelect1.module.css";
import {
    ButtonBase,
    Dialog,
    DialogContent,
    DialogTitle,
    Link,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import { CLIENT_TYPE_TEXT } from "my/constants";
import MyTable from "./MyTable";
import DialogClose from "./DialogClose";

function SelectDialog({ open, onClose, loading, list, onSelect, mustSelect }) {
    const onClick = item => {
        onSelect(item);
        onClose();
    };

    return (
        <Dialog open={open} onClose={!mustSelect && onClose}>
            <DialogTitle>
                选择应用
                {!mustSelect && <DialogClose onClose={onClose} />}
            </DialogTitle>
            <DialogContent style={{ width: 500, paddingBottom: 16 }}>
                <MyTable length={list.length} loading={loading} className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell>应用</TableCell>
                            <TableCell>类型</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Link
                                        className={styles.clientBox}
                                        href="#"
                                        onClick={() => onClick(item)}
                                    >
                                        <img src={item.iconUrl} alt="icon" />
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{CLIENT_TYPE_TEXT[item.type]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
            </DialogContent>
        </Dialog>
    );
}

export default class extends PureComponent {
    state = {
        open: false,
        list: [],
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { onShowEmpty, client } = this.props;

        const list = await http.get("clients");

        if (list.length) {
            this.setState({ loading: false, list });
            if (!client.id) this.toggleDialog();
        } else {
            onShowEmpty();
        }
    };

    toggleDialog = () => {
        this.setState(({ open }) => ({ open: !open }));
    };

    render() {
        const { client, onSelect } = this.props;
        const { open, list, loading } = this.state;

        return (
            <>
                <div className={styles.root}>
                    <span>应用：</span>
                    {client.id ? (
                        <ButtonBase onClick={this.toggleDialog}>
                            <img src={client.iconUrl} alt="icon" />
                            <span className={styles.clientName}>{client.name}</span>
                        </ButtonBase>
                    ) : (
                        "-"
                    )}
                </div>
                <SelectDialog
                    list={list}
                    open={open}
                    onSelect={onSelect}
                    loading={loading}
                    onClose={this.toggleDialog}
                    mustSelect={!client.id}
                />
            </>
        );
    }
}
