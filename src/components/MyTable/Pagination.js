import { IconButton, Input, TablePagination } from "@material-ui/core";
import React, { PureComponent } from "react";
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@material-ui/icons";
import styles from "./index.module.css";

class Actions extends PureComponent {
    state = {
        inputValue: 1
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { page } = this.props;
        if (page !== prevProps.page) this.setState({ inputValue: page + 1 });
    }

    onClick = (event, type) => {
        const { page, onChangePage, count, rowsPerPage } = this.props;
        let newPage;
        switch (type) {
            case "first":
                newPage = 0;
                break;
            case "prev":
                newPage = page - 1;
                break;
            case "next":
                newPage = page + 1;
                break;
            default:
                // last
                newPage = Math.ceil(count / rowsPerPage) - 1;
                break;
        }
        onChangePage(event, newPage);
        this.setState({ inputValue: newPage + 1 });
    };

    onKeyUp = event => {
        const { inputValue } = this.state;
        const { page, count, rowsPerPage, onChangePage } = this.props;

        if (event.key !== "Enter") return;

        if (isNaN(inputValue)) {
            this.setState({ inputValue: page + 1 });
            return;
        }

        let value = Math.round(inputValue) - 1;

        if (value < 0) value = 0;

        const maxPage = Math.ceil(count / rowsPerPage) - 1;
        if (value > maxPage) value = maxPage;

        this.setState({ inputValue: value + 1 });
        onChangePage(event, value);
    };

    onChange = ({ target: { value } }) => {
        this.setState({ inputValue: value });
    };

    render() {
        const { page, count, rowsPerPage } = this.props;
        const { inputValue } = this.state;

        const maxPage = Math.ceil(count / rowsPerPage) - 1;

        return (
            <div className={styles.actionBox}>
                <IconButton
                    onClick={event => this.onClick(event, "first")}
                    disabled={page === 0}
                    title="第一页"
                >
                    <FirstPage />
                </IconButton>
                <IconButton
                    onClick={event => this.onClick(event, "prev")}
                    disabled={page === 0}
                    title="上一页"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <Input
                    id="current-input"
                    value={inputValue}
                    onKeyUp={this.onKeyUp}
                    onChange={this.onChange}
                />{" "}
                / {maxPage + 1} 页
                <IconButton
                    onClick={event => this.onClick(event, "next")}
                    disabled={page >= maxPage}
                    title="下一页"
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={event => this.onClick(event, "last")}
                    disabled={page >= maxPage}
                    title="最后一页"
                >
                    <LastPage />
                </IconButton>
            </div>
        );
    }
}

export default function({ count, rowsPerPage, page, onChangePage, onChangeRowsPerPage }) {
    return (
        <TablePagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            ActionsComponent={Actions}
            labelRowsPerPage="每页条数："
            labelDisplayedRows={({ from, to, count }) => `共 ${count} 条`}
            className={styles.pagination}
        />
    );
}
