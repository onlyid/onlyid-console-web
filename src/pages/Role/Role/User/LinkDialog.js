import React, { PureComponent } from "react";
import http from "my/http";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputAdornment
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import styles from "./index.module.css";
import { withRouter } from "react-router-dom";
import Table from "./Table";

class LinkDialog extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        keyword: "",
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;

        const params = { current, pageSize, keyword, orderBy: "firstDate" };
        const { list, total } = await http.get("users", { params });

        this.setState({ list, total, loading: false });
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    onSearch = () => {
        this.setState({ current: 1 }, this.initData);
    };

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    };

    render() {
        const { list, current, pageSize, total, loading, keyword } = this.state;
        const { open, onClose, onLink } = this.props;

        return (
            <Dialog open={open} onClose={onClose} maxWidth="lg">
                <DialogTitle>
                    关联用户
                    <DialogClose onClose={onClose} />
                </DialogTitle>
                <DialogContent className={styles.dialog}>
                    <div>
                        <FormControl>
                            <Input
                                name="keyword"
                                onChange={this.onChange}
                                value={keyword}
                                startAdornment={
                                    <InputAdornment position="start">搜索</InputAdornment>
                                }
                                placeholder="昵称、手机号、邮箱"
                            />
                        </FormControl>
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
                    <Table
                        list={list}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        loading={loading}
                        onPaginationChange={this.onPaginationChange}
                        onAction={onLink}
                        inDialog
                    />
                </DialogContent>
            </Dialog>
        );
    }
}

export default withRouter(LinkDialog);
