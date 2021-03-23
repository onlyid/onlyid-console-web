import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import http from "my/http";
import ClientTable from "./ClientTable";
import EmptyPage from "components/EmptyPage";
import { Route, Switch, withRouter } from "react-router-dom";
import Client from "./Client";
import CreateDialog from "./CreateDialog";
import GuideDialog from "./GuideDialog";

class Index extends PureComponent {
    state = {
        list: [],
        loading: true,
        createOpen: false,
        guideOpen: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
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
        this.setState({ createOpen: false, loading: true, guideOpen: true });
        this.initData();
    };

    closeGuide = () => {
        this.setState({ guideOpen: false });
    };

    render() {
        const { list, loading, createOpen, guideOpen } = this.state;

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
                </EmptyPage>
            );

        return (
            <>
                <div className="mainActionBox">{createNew}</div>
                <h1>应用管理</h1>
                <p>新建一个应用来使用唯ID的认证产品。</p>
                <ClientTable list={list} />
            </>
        );
    }
}

class Application extends PureComponent {
    render() {
        const { match } = this.props;

        return (
            <div className={styles.root}>
                <Switch>
                    <Route path={`${match.path}/:id`}>
                        <Client />
                    </Route>
                    <Route path={match.path}>
                        <Index />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default withRouter(Application);
