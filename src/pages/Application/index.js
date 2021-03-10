import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import http from "my/http";
import ClientTable from "./ClientTable";
import EmptyPage from "components/EmptyPage";
import { Route, Switch, withRouter } from "react-router-dom";
import Client from "./Client";

class Index extends PureComponent {
    state = {
        list: [],
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const list = await http.get("clients");
        this.setState({ list, loading: false });
    };

    render() {
        const { list, loading } = this.state;

        const createNew = (
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                新建应用
            </Button>
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
                    <Route path={`${match.path}/:clientId`}>
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
