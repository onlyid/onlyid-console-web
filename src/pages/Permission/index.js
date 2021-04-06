import React, { PureComponent } from "react";
import styles from "./index.module.css";
import ClientSelect1 from "components/ClientSelect1";
import EmptyPage from "components/EmptyPage";

class Permission extends PureComponent {
    state = {
        showEmpty: false,
        client: {}
    };

    onSelect = client => {
        this.setState({ client });
    };

    onShowEmpty = () => {
        this.setState({ showEmpty: true });
    };

    render() {
        const { client, showEmpty } = this.state;

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
            </div>
        );
    }
}

export default Permission;
