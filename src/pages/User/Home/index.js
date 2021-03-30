import React, { PureComponent } from "react";
import ImportDialog from "./ImportDialog";
import CreateDialog from "./CreateDialog";
import MyEmptyPage from "./MyEmptyPage";
import MainActionBox from "./MainActionBox";
import SelectBar from "./SelectBar";
import http from "my/http";
import UserTable from "./UserTable";
import { connect } from "react-redux";

class Home extends PureComponent {
    state = {
        importOpen: false,
        createOpen: false
    };

    componentDidMount() {
        const {
            user: { list }
        } = this.props;

        // 如果是返回 则初始化一次即可
        if (list.length) this.initData();
        else this.initDataTwice();
    }

    initDataTwice = async () => {
        let total = await this.initData();
        if (total > 0) return;

        const { dispatch } = this.props;
        await dispatch({ type: "user", type1: "import" });

        total = await this.initData();
        if (total > 0) return;

        dispatch({ type: "user", showEmpty: true });
    };

    initData = async () => {
        const { dispatch } = this.props;
        dispatch({ type: "user", loading: true });

        const {
            user: { current, pageSize, keyword, type1, clientId, orderBy, activated }
        } = this.props;

        const params = { current, pageSize, keyword };
        let url = "users";
        if (type1 === "sso") {
            params.orderBy = orderBy;
            if (clientId !== "all") params.clientId = clientId;
        } else if (type1 === "import") {
            url += "/import";
            if (activated !== "all") params.activated = activated;
        } else {
            url += "/blacklist";
        }

        const { list, total } = await http.get(url, { params });

        dispatch({
            type: "user",
            list,
            total,
            loading: false,
            realType: type1,
            realOrderBy: orderBy
        });

        return total;
    };

    toggleImport = () => {
        this.setState(({ importOpen }) => ({ importOpen: !importOpen }));
    };

    saveImport = () => {
        this.toggleImport();
        this.initImportData();
    };

    toggleCreate = () => {
        this.setState(({ createOpen }) => ({ createOpen: !createOpen }));
    };

    saveCreate = () => {
        this.toggleCreate();
        this.initImportData();
    };

    initImportData = async () => {
        const { dispatch } = this.props;
        await dispatch({
            type: "user",
            current: 1,
            keyword: "",
            type1: "import",
            activated: "all",
            showEmpty: false
        });
        this.initData();
    };

    onClientChange = clientId => {
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
            case "activated-select":
                key = "activated";
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
        const { importOpen, createOpen } = this.state;
        const {
            user: {
                showEmpty,
                type1,
                clientId,
                orderBy,
                activated,
                keyword,
                list,
                loading,
                current,
                pageSize,
                total,
                realType,
                realOrderBy
            }
        } = this.props;

        const dialogs = (
            <>
                <ImportDialog
                    open={importOpen}
                    onCancel={this.toggleImport}
                    onSave={this.saveImport}
                    key={Date()}
                />
                <CreateDialog
                    open={createOpen}
                    onCancel={this.toggleCreate}
                    onSave={this.saveCreate}
                    key={Date() + "1"}
                />
            </>
        );

        if (showEmpty)
            return (
                <>
                    <MyEmptyPage onCreate={this.toggleCreate} onImport={this.toggleImport} />
                    {dialogs}
                </>
            );

        return (
            <>
                <MainActionBox
                    onCreate={this.toggleCreate}
                    onImport={this.toggleImport}
                    onExport={null}
                />
                <h1>用户管理</h1>
                <p>
                    简单快捷地管理你的用户，如查看应用新增用户、查看用户登录历史和屏蔽用户登录应用等等。
                </p>
                <SelectBar
                    type={type1}
                    clientId={clientId}
                    orderBy={orderBy}
                    activated={activated}
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
                <div className="tipBox" style={{ marginTop: 20 }}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            只通过OTP接收验证码完成认证的用户，不认为是正式用户，不会出现在本页。
                        </li>
                        <li>
                            当排序筛选栏选择 "最近新增"
                            时，右侧登录应用是指该用户新增时登录的应用，而不是最近一次登录的应用。
                        </li>
                        <li>
                            当手工导入/新建的用户登录了你名下任意应用，该用户也会出现在 "SSO
                            自然增长" 列表。
                        </li>
                    </ol>
                </div>
                {dialogs}
            </>
        );
    }
}

export default connect(({ user }) => ({ user }))(Home);
