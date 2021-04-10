import React, { PureComponent } from "react";
import styles from "./index.module.css";
import ClientSelect1 from "components/ClientSelect1";
import EmptyPage from "components/EmptyPage";
import Add from "./Add";
import Table from "./Table";
import http from "my/http";
import tipBox from "components/TipBox.module.css";
import { withRouter } from "react-router-dom";

class Permission extends PureComponent {
    state = {
        showEmpty: false,
        list: [],
        loading: true
    };

    componentDidMount() {
        const {
            match: { params }
        } = this.props;
        if (params.clientId) this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        this.setState({ loading: true });

        const params = { clientId: match.params.clientId };
        const list = await http.get("permissions", { params });
        this.setState({ list, loading: false });
    };

    onChange = async clientId => {
        const { history } = this.props;
        await history.replace(`/permissions/${clientId}`);
        this.initData();
    };

    onShowEmpty = () => {
        this.setState({ showEmpty: true });
    };

    render() {
        const {
            match: { params }
        } = this.props;
        const { showEmpty, list, loading } = this.state;

        if (showEmpty)
            return (
                <EmptyPage
                    title="权限管理"
                    icon="vpn_key"
                    description="权限以应用维度划分，请先到应用管理新建应用"
                />
            );

        return (
            <div className={styles.root}>
                <div className="mainActionBox">
                    <ClientSelect1
                        value={params.clientId}
                        onChange={this.onChange}
                        onShowEmpty={this.onShowEmpty}
                    />
                </div>
                <h1>权限管理</h1>
                <p>简单灵活地管理你应用的权限。</p>
                <Add clientId={params.clientId} onSave={this.initData} />
                <Table list={list} loading={loading} onChange={this.initData} />
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            本页仅配置应用的权限，要使这些权限发挥作用，还需要将权限分配给角色，并将角色分配给实际用户，请参阅相关文档。
                        </li>
                        <li>
                            权限抽象成对资源的操作，一般权限是一个名词（如appointment），而操作是一个动词（如read）。
                        </li>
                        <li>
                            唯ID的权限控制非常灵活，你可以忽略本页，只使用角色做权限控制，又或者只使用资源，而不使用操作，更多最佳实践请参阅相关文档。
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default withRouter(Permission);
