import React, { PureComponent } from "react";
import http from "my/http";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import EmptyPage from "components/EmptyPage";
import CreateDialog from "./CreateDialog";
import GuideDialog from "./GuideDialog";
import ClientTable from "./ClientTable";
import moment from "moment";
import WelcomeDialog from "./WelcomeDialog";

export default class extends PureComponent {
    state = {
        list: [],
        loading: true,
        createOpen: false,
        guideOpen: false,
        welcomeOpen: false
    };

    componentDidMount() {
        this.initData();

        const tenantInfo = localStorage.getObj("tenantInfo");
        if (moment(tenantInfo.createDate) > moment().subtract(5, "seconds"))
            this.setState({ welcomeOpen: true });
    }

    initData = async () => {
        this.setState({ loading: true });
        const list = await http.get("clients");
        this.setState({ list, loading: false });
    };

    openCreate = () => {
        this.setState({ createOpen: true });
    };

    cancelCreate = () => {
        this.setState({ createOpen: false });
    };

    saveCreate = () => {
        this.setState({ createOpen: false, guideOpen: true });
        this.initData();
    };

    closeGuide = () => {
        this.setState({ guideOpen: false });
    };

    closeWelcome = () => {
        this.setState({ welcomeOpen: false });
    };

    render() {
        const { list, loading, createOpen, guideOpen, welcomeOpen } = this.state;

        const createNew = (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.openCreate}
                >
                    新建应用
                </Button>
                <CreateDialog
                    open={createOpen}
                    onCancel={this.cancelCreate}
                    onSave={this.saveCreate}
                    key={Date()}
                />
                <GuideDialog open={guideOpen} onClose={this.closeGuide} />
            </>
        );

        if (!list.length && !loading)
            return (
                <EmptyPage title="应用管理" icon="apps" description="暂无应用，请新建">
                    {createNew}
                    <WelcomeDialog
                        open={welcomeOpen}
                        onClose={this.closeWelcome}
                        onCreate={this.openCreate}
                    />
                </EmptyPage>
            );

        return (
            <>
                <div className="mainActionBox">{createNew}</div>
                <h1>应用管理</h1>
                <p>新建一个应用来使用唯ID的认证产品。</p>
                <ClientTable list={list} loading={loading} />
            </>
        );
    }
}
