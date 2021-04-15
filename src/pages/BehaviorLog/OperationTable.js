import React, { PureComponent } from "react";
import styles from "./Table.module.css";
import { Popover, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import MyTable from "components/MyTable";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import SuccessStatus from "components/SuccessStatus";

export default class extends PureComponent {
    state = {
        anchorEl: null,
        description: ""
    };

    openDesc = (e, description) => {
        this.setState({ anchorEl: e.currentTarget, description });
    };

    closeDesc = () => {
        this.setState({ anchorEl: null });
    };

    formatDesc = () => {
        const { description } = this.state;
        if (!description) return "-";

        const list = description.split("\n");

        return list.map((item, index) => <p key={index}>{item}</p>);
    };

    render() {
        const { list, loading, current, pageSize, total, onPaginationChange } = this.props;
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
                            <TableCell>操作</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>应用</TableCell>
                            <TableCell>IP、地点、时间</TableCell>
                            <TableCell>状态、错误信息</TableCell>
                            <TableCell>类型</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell className={styles.operation}>{item.operation}</TableCell>
                                <TableCell
                                    className={styles.description}
                                    onClick={event => this.openDesc(event, item.description)}
                                >
                                    {item.description || "-"}
                                </TableCell>
                                <TableCell className={styles.clientName}>
                                    {item.clientName || "-"}
                                </TableCell>
                                <TableCell className={styles.info}>
                                    {item.ip || "-"}
                                    <br />
                                    {item.location || "-"}
                                    <br />
                                    {moment(item.createDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell className={styles.status}>
                                    <SuccessStatus success={item.success} />
                                    {!item.success && <p>{item.errMsg}</p>}
                                </TableCell>
                                <TableCell className={styles.type}>
                                    {item.type === "CONSOLE" ? "控制台" : "Open API"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
                <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={this.closeDesc}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "left"
                    }}
                >
                    <div className={styles.descBox}>{this.formatDesc()}</div>
                </Popover>
            </>
        );
    }
}
