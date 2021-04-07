import React, { PureComponent } from "react";
import styles from "./index.module.css";
import ClientSelect1 from "components/ClientSelect1";
import EmptyPage from "components/EmptyPage";
import Add from "./Add";
import Table from "./Table";
import http from "my/http";

class Permission extends PureComponent {
    state = {
        showEmpty: false,
        client: {},
        list: [],
        loading: true
    };

    initData = async () => {
        const { client } = this.state;
        this.setState({ loading: true });

        const params = { clientId: client.id };
        const list = await http.get("permissions", { params });
        this.setState({ list, loading: false });
    };

    onSelect = client => {
        this.setState({ client }, this.initData);
    };

    onShowEmpty = () => {
        this.setState({ showEmpty: true });
    };

    render() {
        const { client, showEmpty, list, loading } = this.state;

        if (showEmpty)
            return (
                <EmptyPage
                    title="权限管理"
                    icon="vpn_key"
                    description="权限管理以应用为维度，请先到应用管理新建一个应用"
                />
            );

        return (
            <div className={styles.root}>
                <div className="mainActionBox">
                    <ClientSelect1
                        client={client}
                        onSelect={this.onSelect}
                        onShowEmpty={this.onShowEmpty}
                    />
                </div>
                <h1>权限管理</h1>
                <p>管理应用权限，简单又灵活。</p>
                <Add clientId={client.id} onSave={this.initData} />
                <Table list={list} loading={loading} onChange={this.initData} />
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            本页仅配置应用的权限，要使这些权限发挥作用，还需要将权限和角色关联，再将角色和用户关联，请参阅相关文档。
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

export default Permission;
