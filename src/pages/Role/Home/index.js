import React, { PureComponent } from "react";
import ClientSelect1 from "components/ClientSelect1";
import EmptyPage from "components/EmptyPage";
import http from "my/http";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import CreateDialog from "./CreateDialog";
import RoleTable from "./RoleTable";
import { connect } from "react-redux";

class Home extends PureComponent {
    state = {
        showEmpty: false,
        list: [],
        loading: true,
        createOpen: false
    };

    componentDidMount() {
        const {
            role: { client }
        } = this.props;
        if (client.id) this.initData();
    }

    initData = async () => {
        const {
            role: { client }
        } = this.props;
        this.setState({ loading: true });

        const params = { clientId: client.id };
        const list = await http.get("roles", { params });
        this.setState({ list, loading: false });
    };

    onSelect = async client => {
        const { dispatch } = this.props;
        await dispatch({ type: "role", client });
        this.initData();
    };

    onShowEmpty = () => {
        this.setState({ showEmpty: true });
    };

    toggleCreate = () => {
        this.setState(({ createOpen }) => ({ createOpen: !createOpen }));
    };

    saveCreate = () => {
        this.toggleCreate();
        this.initData();
    };

    render() {
        const {
            role: { client }
        } = this.props;
        const { showEmpty, list, loading, createOpen } = this.state;

        if (showEmpty) {
            return (
                <EmptyPage
                    title="角色管理"
                    icon="account_box"
                    description="角色管理以应用为维度，请先到应用管理新建一个应用"
                />
            );
        }

        return (
            <>
                <div className="mainActionBox">
                    <ClientSelect1
                        client={client}
                        onSelect={this.onSelect}
                        onShowEmpty={this.onShowEmpty}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={this.toggleCreate}
                    >
                        新建角色
                    </Button>
                </div>
                <h1>角色管理</h1>
                <p>管理应用的角色，角色是一系列权限的集合，可以分配给用户。</p>
                <RoleTable list={list} loading={loading} />
                <CreateDialog
                    open={createOpen}
                    onCancel={this.toggleCreate}
                    onSave={this.saveCreate}
                    key={Date()}
                    clientId={client.id}
                />
            </>
        );
    }
}

export default connect(({ role }) => ({ role }))(Home);
