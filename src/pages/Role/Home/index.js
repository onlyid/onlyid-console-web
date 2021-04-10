import React, { PureComponent } from "react";
import EmptyPage from "components/EmptyPage";
import http from "my/http";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import CreateDialog from "./CreateDialog";
import RoleTable from "./RoleTable";
import selectBar from "components/SelectBar.module.css";
import ClientSelect from "components/ClientSelect";
import { connect } from "react-redux";

class Home extends PureComponent {
    state = {
        showEmpty: false,
        loading: true,
        createOpen: false
    };

    componentDidMount() {
        const {
            role: { list }
        } = this.props;

        // 如果是返回 不需要重设empty
        this.initData(!list.length);
    }

    initData = async setEmpty => {
        this.setState({ loading: true });
        const {
            dispatch,
            role: { current, pageSize, clientId }
        } = this.props;

        const params = { current, pageSize };
        if (clientId !== "all") params.clientId = clientId;

        const { list, total } = await http.get("roles", { params });
        this.setState({ loading: false });
        dispatch({ type: "role", list, total });

        if (setEmpty && !list.length) this.setState({ showEmpty: true });
    };

    toggleCreate = () => {
        this.setState(({ createOpen }) => ({ createOpen: !createOpen }));
    };

    saveCreate = () => {
        this.toggleCreate();
        this.initData();
        this.setState({ showEmpty: false });
    };

    onClientChange = clientId => {
        const { dispatch } = this.props;
        dispatch({ type: "role", clientId });
    };

    onSearch = async () => {
        const { dispatch } = this.props;
        await dispatch({ type: "role", current: 1 });
        this.initData();
    };

    onPaginationChange = async ({ pageSize, current }) => {
        const { dispatch } = this.props;
        await dispatch({ type: "role", pageSize, current });
        this.initData();
    };

    render() {
        const { showEmpty, loading, createOpen } = this.state;
        const {
            role: { clientId, current, pageSize, total, list }
        } = this.props;

        const createNew = (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.toggleCreate}
                >
                    新建角色
                </Button>
                <CreateDialog
                    open={createOpen}
                    onCancel={this.toggleCreate}
                    onSave={this.saveCreate}
                    key={Date()}
                />
            </>
        );

        if (showEmpty) {
            return (
                <EmptyPage title="角色管理" icon="account_box" description="暂无角色，请新建">
                    {createNew}
                </EmptyPage>
            );
        }

        return (
            <>
                <div className="mainActionBox">{createNew}</div>
                <h1>角色管理</h1>
                <p>管理应用的角色，角色是一系列权限的集合，可以分配给用户。</p>
                <div className={selectBar.root}>
                    <ClientSelect value={clientId} onChange={this.onClientChange} />
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
                <RoleTable
                    list={list}
                    loading={loading}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onPaginationChange={this.onPaginationChange}
                />
            </>
        );
    }
}

export default connect(({ role }) => ({ role }))(Home);
