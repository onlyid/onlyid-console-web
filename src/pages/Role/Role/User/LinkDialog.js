import React, { PureComponent } from "react";
import http from "my/http";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputAdornment,
    MenuItem,
    Select
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
        loading: true,
        type: "sso"
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword, type } = this.state;
        const params = {
            current,
            pageSize,
            keyword
        };

        let url = "users";
        if (type === "sso") {
            params.orderBy = "firstDate";
        } else if (type === "import") {
            url += "/import";
        } else {
            url += "/blacklist";
        }

        const { list, total } = await http.get(url, { params });

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
        const { list, current, pageSize, total, loading, keyword, type } = this.state;
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
                            <Select
                                name="type"
                                value={type}
                                onChange={this.onChange}
                                startAdornment={
                                    <InputAdornment position="start">类型</InputAdornment>
                                }
                            >
                                <MenuItem value="sso">SSO 自然增长</MenuItem>
                                <MenuItem value="import">手工导入/新建</MenuItem>
                                <MenuItem value="blacklist">已屏蔽黑名单</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{ marginLeft: 35 }}>
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
