import React, { PureComponent } from "react";
import ExportDialog from "./ExportDialog";
import EmptyPage from "components/EmptyPage";
import MainActionBox from "./MainActionBox";
import SelectBar from "./SelectBar";
import http from "my/http";
import UserTable from "./UserTable";
import { connect } from "react-redux";
import tipBox from "components/TipBox.module.css";
import { withRouter } from "react-router-dom";

class Home extends PureComponent {
    state = {
        exportOpen: false,
        loading: true,
        showEmpty: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { dispatch, user } = this.props;
        const { current, pageSize, keyword, clientId, orderBy } = user;

        this.setState({ loading: true });

        const params = { current, pageSize, keyword, orderBy };
        if (clientId !== "all") params.clientId = clientId;

        const { list, total } = await http.get("users", { params });
        if (list.length || current === 1) {
            dispatch({ type: "user", list, total, realOrderBy: orderBy });
            this.setState({ loading: false });

            // 当筛选条件不生效，列表仍然为空，那么就展示空页
            if (!list.length && clientId === "all" && !keyword) this.setState({ showEmpty: true });
        } else {
            await dispatch({ type: "user", current: current - 1 });
            this.initData();
        }
    };

    toggleExport = () => {
        this.setState(({ exportOpen }) => ({ exportOpen: !exportOpen }));
    };

    goBlacklist = () => {
        const { history, match } = this.props;
        history.push(`${match.url}/blacklist`);
    };

    onClientChange = (clientId) => {
        const { dispatch } = this.props;
        dispatch({ type: "user", clientId });
    };

    onChange = ({ target }) => {
        const { dispatch } = this.props;
        dispatch({ type: "user", [target.name]: target.value });
    };

    onSearch = async () => {
        const { dispatch } = this.props;

        await dispatch({ type: "user", current: 1 });
        this.initData();
    };

    onPaginationChange = async ({ pageSize, current }) => {
        const { dispatch } = this.props;

        await dispatch({ type: "user", pageSize, current });
        this.initData();
    };

    render() {
        const { exportOpen, loading, showEmpty } = this.state;
        const { user } = this.props;
        const { clientId, orderBy, keyword, list, current, pageSize, total, realOrderBy } = user;

        if (showEmpty)
            return (
                <EmptyPage
                    title="用户列表"
                    icon="person"
                    description="暂无用户；应用接入SSO后，登录的用户会出现在本页"
                />
            );

        return (
            <>
                <MainActionBox onExport={this.toggleExport} goBlacklist={this.goBlacklist} />
                <h1>用户列表</h1>
                <p>提供基础的用户管理功能，如查看应用新增用户、禁止恶意用户登录等。</p>
                <SelectBar
                    clientId={clientId}
                    orderBy={orderBy}
                    keyword={keyword}
                    onChange={this.onChange}
                    onClientChange={this.onClientChange}
                    onSearch={this.onSearch}
                />
                <UserTable
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                    orderBy={realOrderBy}
                />
                <div className={tipBox.root} style={{ marginTop: 20 }}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            只通过OTP接收验证码完成认证的用户，不认为是正式用户，不会出现在本页。
                        </li>
                        <li>
                            当排序筛选栏选择 "最近新增"
                            时，右侧登录应用是指该用户新增时登录的应用，而不是最近一次登录的应用。
                        </li>
                    </ol>
                </div>
                <ExportDialog open={exportOpen} onClose={this.toggleExport} key={Date()} />
            </>
        );
    }
}

export default connect(({ user }) => ({ user }))(withRouter(Home));
