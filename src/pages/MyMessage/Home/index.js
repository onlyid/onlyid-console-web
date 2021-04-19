import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputAdornment
} from "@material-ui/core";
import { connect } from "react-redux";
import http from "my/http";
import { eventEmitter } from "my/utils";
import selectBar from "components/SelectBar.module.css";
import MessageTable from "./MessageTable";
import DialogClose from "components/DialogClose";
import { withRouter } from "react-router-dom";

class MyMessage extends PureComponent {
    state = {
        loading: true,
        confirmOpen: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const {
            myMessage: { current, pageSize, keyword },
            dispatch
        } = this.props;

        const params = { current, pageSize, keyword };
        const { list, total } = await http.get("my-messages", { params });

        if (list.length || current === 1) {
            dispatch({ type: "myMessage", list, total });
            this.setState({ loading: false });
        } else {
            await dispatch({ type: "myMessage", current: current - 1 });
            this.initData();
        }
    };

    toggleConfirm = () => {
        this.setState(({ confirmOpen }) => ({ confirmOpen: !confirmOpen }));
    };

    markReadAll = async () => {
        await http.put("my-messages/mark-read-all");
        await this.initData();
        eventEmitter.emit("app/openToast", { text: "操作成功", timeout: 2000 });
        eventEmitter.emit("myMessage/countChange");
        this.toggleConfirm();
    };

    onPaginationChange = async ({ pageSize, current }) => {
        const { dispatch } = this.props;
        await dispatch({ type: "myMessage", pageSize, current });
        this.initData();
    };

    onChange = async ({ target }) => {
        const { dispatch } = this.props;
        await dispatch({ type: "myMessage", [target.name]: target.value });
    };

    onSearch = async () => {
        const { dispatch } = this.props;
        await dispatch({ type: "myMessage", current: 1 });
        this.initData();
    };

    goNotification = () => {
        const { history } = this.props;

        history.push("/tenant/notification");
    };

    render() {
        const { loading, confirmOpen } = this.state;
        const {
            myMessage: { unreadCount, totalCount, keyword, list, current, pageSize, total }
        } = this.props;

        return (
            <>
                <div className="mainActionBox">
                    <Button variant="contained" onClick={this.goNotification}>
                        通知设置
                    </Button>
                    <Button variant="contained" onClick={this.toggleConfirm}>
                        全部标为已读
                    </Button>
                </div>
                <h1>站内信</h1>
                <p>
                    共 {totalCount} 封消息，其中 {unreadCount} 封未读。
                </p>
                <div className={selectBar.root}>
                    <FormControl>
                        <Input
                            name="keyword"
                            onChange={this.onChange}
                            value={keyword}
                            startAdornment={<InputAdornment position="start">搜索</InputAdornment>}
                            placeholder="消息标题"
                        />
                    </FormControl>
                    <Button
                        color="primary"
                        variant="contained"
                        className="small"
                        startIcon={<span className="material-icons">search</span>}
                        onClick={this.onSearch}
                    >
                        查 询
                    </Button>
                </div>
                <MessageTable
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                    onDelete={this.initData}
                />
                <Dialog open={confirmOpen} onClose={this.toggleConfirm}>
                    <DialogTitle>
                        确定
                        <DialogClose onClose={this.toggleConfirm} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, minWidth: 400 }}>确定全部标为已读？</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleConfirm}>取 消</Button>
                        <Button onClick={this.markReadAll} color="secondary">
                            确 定
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default connect(({ myMessage }) => ({ myMessage }))(withRouter(MyMessage));
