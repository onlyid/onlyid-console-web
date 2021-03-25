import React, { PureComponent } from "react";
import ImportDialog from "./ImportDialog";
import CreateDialog from "./CreateDialog";
import MyEmptyPage from "./MyEmptyPage";
import MainActionBox from "./MainActionBox";
import SelectBar from "./SelectBar";
import http from "my/http";
import UserTable from "./UserTable";

class Home extends PureComponent {
    state = {
        importOpen: false,
        createOpen: false,
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        keyword: "",
        type: "sso",
        clientId: "all",
        orderBy: "new",
        activated: "all",
        loading: true,
        showEmpty: false,
        actualType: "sso"
    };

    componentDidMount() {
        this.initDataTwice();
    }

    initDataTwice = async () => {
        const total = await this.initData();
        if (total > 0) return;

        this.setState({ type: "import" }, async () => {
            const total = await this.initData();
            if (total > 0) return;

            this.setState({ showEmpty: true });
        });
    };

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword, type, clientId, orderBy, activated } = this.state;

        const params = { current, pageSize, keyword };
        let url = "users";
        if (type === "sso") {
            params.orderBy = orderBy;
            if (clientId !== "all") params.clientId = clientId;
        } else if (type === "import") {
            url += "/import";
            if (activated !== "all") params.activated = activated;
        } else {
            url += "/blacklist";
        }

        const { list, total } = await http.get(url, { params });

        this.setState({ list, total, loading: false, actualType: type });

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

    initImportData = () => {
        const state = {
            current: 1,
            keyword: "",
            type: "import",
            activated: "all",
            showEmpty: false
        };
        this.setState(state, this.initData);
    };

    onClientChange = clientId => {
        this.setState({ clientId });
    };

    onChange = ({ target }) => {
        let key;
        switch (target.name) {
            case "type-select":
                key = "type";
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
        this.setState({ [key]: target.value });
    };

    onSearch = () => {
        this.setState({ current: 1 }, this.initData);
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    render() {
        const {
            importOpen,
            createOpen,
            showEmpty,
            type,
            clientId,
            orderBy,
            activated,
            keyword,
            list,
            loading,
            current,
            pageSize,
            total,
            actualType
        } = this.state;

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
                    type={type}
                    clientId={clientId}
                    orderBy={orderBy}
                    activated={activated}
                    keyword={keyword}
                    onChange={this.onChange}
                    onClientChange={this.onClientChange}
                    onSearch={this.onSearch}
                />
                <UserTable
                    type={actualType}
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                />
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            仅通过OTP接收验证码完成认证的用户，不认为是正式用户，不会出现在本页。
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

export default Home;
