import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { CircularProgress, Table, TableCell, TableFooter, TableRow } from "@material-ui/core";
import Empty from "../Empty";
import Pagination from "./Pagination";
import classNames from "classnames";

export default class extends PureComponent {
    onChangePage = (event, page) => {
        const { onPaginationChange, pagination } = this.props;
        onPaginationChange({ pageSize: pagination.pageSize, current: page + 1 });
    };

    onChangeRowsPerPage = event => {
        const { onPaginationChange } = this.props;
        onPaginationChange({ pageSize: event.target.value, current: 1 });
    };

    render() {
        const { children, length, loading, pagination, className } = this.props;

        const emptyRows = length && length < 5 ? 5 - length : 0;

        return (
            <div className={styles.root}>
                <div className={classNames({ [styles.loadingTable]: loading })}>
                    <Table className={className}>
                        {children}
                        {emptyRows > 0 && (
                            <TableFooter>
                                <TableRow style={{ height: 55 * emptyRows }}>
                                    <TableCell colSpan={1000} />
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                    {length > 0 && pagination && (
                        <Pagination
                            count={pagination.total}
                            rowsPerPage={pagination.pageSize}
                            page={pagination.current - 1}
                            onChangePage={this.onChangePage}
                            onChangeRowsPerPage={this.onChangeRowsPerPage}
                        />
                    )}
                    {!length && (
                        <div className={styles.emptyBox}>
                            <Empty simple description="暂无数据" />
                        </div>
                    )}
                </div>
                {loading && <CircularProgress className={styles.loading} />}
            </div>
        );
    }
}
