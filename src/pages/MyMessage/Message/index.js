import React, { PureComponent } from "react";
import http from "my/http";
import { eventEmitter } from "my/utils";
import MainHeader from "components/MainHeader";
import { withRouter } from "react-router-dom";
import LevelSymbol from "components/LevelSymbol";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper
} from "@material-ui/core";
import styles from "./index.module.css";
import { Delete } from "@material-ui/icons";
import DialogClose from "components/DialogClose";
import { connect } from "react-redux";

class Index extends PureComponent {
    state = {
        message: {
            html: ""
        },
        deleteOpen: false,
        prevId: null,
        nextId: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            match,
            myMessage: { keyword }
        } = this.props;

        const message = await http.get(`my-messages/${match.params.id}`);

        this.setState({ message });

        const params = { keyword };
        const data = await http.get(`my-messages/${match.params.id}/adjacent`, { params });
        const { prevId, nextId } = data;
        this.setState({ prevId, nextId });

        if (!message.isRead) {
            await http.put(`my-messages/${match.params.id}/mark-read`);
            eventEmitter.emit("myMessage/countChange");
        }
    };

    toggleDelete = () => {
        this.setState(({ deleteOpen }) => ({ deleteOpen: !deleteOpen }));
    };

    submitDelete = async () => {
        const { match, history } = this.props;

        await http.delete("my-messages/" + match.params.id);
        eventEmitter.emit("myMessage/countChange");
        eventEmitter.emit("app/openToast", { text: "删除成功", timeout: 2000 });

        history.goBack();
    };

    go = async type => {
        const id = type === "prev" ? this.state.prevId : this.state.nextId;
        const { history } = this.props;
        await history.replace("/my-messages/" + id);
        this.initData();
    };

    render() {
        const { message, deleteOpen, prevId, nextId } = this.state;
        const userInfo = localStorage.getObj("userInfo");

        const html = message.html
            .replace("#nickname#", userInfo.nickname)
            .replace(/<h1[\s\S]+<\/h1>/, "");

        return (
            <>
                <div className="mainActionBox">
                    <Button
                        variant="contained"
                        disabled={!prevId}
                        onClick={() => this.go("prev")}
                        className="small"
                    >
                        上一封
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!nextId}
                        onClick={() => this.go("next")}
                        className="small"
                    >
                        下一封
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Delete />}
                        onClick={this.toggleDelete}
                        className="small"
                    >
                        删除
                    </Button>
                </div>
                <MainHeader backText="返回上一页" title="">
                    <ul>
                        <li>
                            <span>级别：</span>
                            <span>
                                <LevelSymbol important={message.important} />
                            </span>
                        </li>
                        <li>
                            <span>时间：</span>
                            <span>{moment(message.createDate).format(DATE_TIME_FORMAT)}</span>
                        </li>
                    </ul>
                </MainHeader>
                <Paper className={styles.content} variant="outlined">
                    <h1>{message.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </Paper>
                <Dialog open={deleteOpen} onClose={this.toggleDelete}>
                    <DialogTitle>
                        删除消息
                        <DialogClose onClose={this.toggleDelete} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, minWidth: 400 }}>删除后不可恢复，确定删除？</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleDelete}>取 消</Button>
                        <Button onClick={this.submitDelete} color="secondary">
                            删 除
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default connect(({ myMessage }) => ({ myMessage }))(withRouter(Index));
