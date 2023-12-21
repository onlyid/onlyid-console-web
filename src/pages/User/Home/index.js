import React, { PureComponent } from "react";
import ExportDialog from "./ExportDialog";
import EmptyPage from "components/EmptyPage";
import MainActionBox from "./MainActionBox";
import SelectBar from "./SelectBar";
import http from "my/http";
import UserTable from "./UserTable";
import { connect } from "react-redux";
import tipBox from "components/TipBox.module.css";

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
        const { dispatch } = this.props;
        this.setState({ loading: true });

        const { user } = this.props;
        const { current, pageSize, keyword, type1, clientId, orderBy } = user;

        const params = { current, pageSize, keyword };
        let url = "users";
        if (type1 === "sso") {
            params.orderBy = orderBy;
            if (clientId !== "all") params.clientId = clientId;
        } else {
            url += "/blacklist";
        }

        const { list, total } = await http.get(url, { params });
        if (list.length || current === 1) {
            dispatch({ type: "user", list, total, realType: type1, realOrderBy: orderBy });
            this.setState({ loading: false });

            // 当所有筛选条件不生效，列表仍然为空，那么就展示空页
            if (!list.length && type1 === "sso" && clientId === "all" && !keyword)
                this.setState({ showEmpty: true });
        } else {
            await dispatch({ type: "user", current: current - 1 });
            this.initData();
        }
    };

    toggleExport = () => {
        this.setState(({ exportOpen }) => ({ exportOpen: !exportOpen }));
    };

    onClientChange = (clientId) => {
        const { dispatch } = this.props;
        dispatch({ type: "user", clientId });
    };

    onChange = ({ target }) => {
        const { dispatch } = this.props;

        let key;
        switch (target.name) {
            case "type-select":
                key = "type1";
                break;
            case "order-by-select":
                key = "orderBy";
                break;
            default:
                key = target.name;
        }
        dispatch({ type: "user", [key]: target.value });
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
        const {
            user: {
                type1,
                clientId,
                orderBy,
                keyword,
                list,
                current,
                pageSize,
                total,
                realType,
                realOrderBy
            }
        } = this.props;

        if (showEmpty)
            return (
                <EmptyPage
                    title="用户管理"
                    icon="person"
                    description="暂无用户；应用接入SSO后，登录的用户会出现在本页"
                />
            );

        return (
            <>
                <MainActionBox onExport={this.toggleExport} />
                <h1>用户管理</h1>
                <p>
                    简单快捷地管理你的用户，如查看应用新增用户、查看用户登录历史和屏蔽用户登录应用等等。
                </p>
                <SelectBar
                    type={type1}
                    clientId={clientId}
                    orderBy={orderBy}
                    keyword={keyword}
                    onChange={this.onChange}
                    onClientChange={this.onClientChange}
                    onSearch={this.onSearch}
                />
                <UserTable
                    type={realType}
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

export default connect(({ user }) => ({ user }))(Home);
