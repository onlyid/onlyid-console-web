import React, { PureComponent } from "react";
import { Empty, Input, message, Modal, Tree } from "antd";
import http from "my/http";
import styles from "./index.module.css";
import TreeNodeTitle from "components/TreeNodeTitle";

const { Search } = Input;
const { TreeNode } = Tree;

class SelectRoleDialog extends PureComponent {
    state = {
        expandedKeys: [],
        autoExpandParent: false,
        apps: [],
        keyword: "",
        selectedKey: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const apps = await http.get("clients");

        for (const app of apps) {
            const params = { clientId: app.id };
            const list = await http.get("roles/groups", { params });
            app.roleGroups = list.filter(item => item.roles.length);
        }

        this.setState({ apps: apps.filter(item => item.roleGroups.length) });
    };

    onCancel = () => {
        this.setState({ selectedKey: null });
        const { onCancel } = this.props;
        onCancel();
    };

    submit = () => {
        const { selectedKey } = this.state;
        const { onSelect } = this.props;

        if (!selectedKey) {
            message.warn(`请选择一个角色`);
            return;
        }

        onSelect(selectedKey);
        this.setState({ selectedKey: null });
    };

    onSearch = keyword => {
        const { apps } = this.state;

        if (keyword) {
            const set = new Set();
            for (const { roleGroups } of apps) {
                roleGroups
                    .filter(({ name }) => name.includes(keyword))
                    .forEach(item => set.add("a" + item.clientId));
                for (const { roles } of roleGroups) {
                    roles
                        .filter(({ name }) => name.includes(keyword))
                        .forEach(item => set.add("g" + item.groupId));
                }
            }
            this.setState({ keyword, expandedKeys: [...set], autoExpandParent: true });
        } else {
            this.setState({
                keyword: "",
                expandedKeys: [],
                autoExpandParent: false
            });
        }
    };

    onExpand = expandedKeys => {
        this.setState({ expandedKeys, autoExpandParent: false });
    };

    onSelect = ([selectedKey]) => {
        this.setState({ selectedKey });
    };

    renderTree = () => {
        const { apps, keyword } = this.state;

        const renderRoleGroups = roleGroups => {
            // 和role manage的tree menu一样
            return roleGroups.map(group => (
                <TreeNode
                    title={<TreeNodeTitle title={group.name} keyword={keyword} />}
                    key={"g" + group.id}
                    icon={<i className="material-icons">folder_shared</i>}
                    dataRef={group}
                    selectable={false}
                >
                    {group.roles.map(role => (
                        <TreeNode
                            title={<TreeNodeTitle title={role.name} keyword={keyword} />}
                            key={String(role.id)}
                            icon={<i className="material-icons">account_box</i>}
                            dataRef={role}
                        />
                    ))}
                </TreeNode>
            ));
        };

        return apps.map(app => (
            <TreeNode
                title={<TreeNodeTitle title={app.name} keyword={keyword} />}
                key={"a" + app.id}
                icon={<i className="material-icons">apps</i>}
                dataRef={app}
                selectable={false}
            >
                {app.roleGroups && renderRoleGroups(app.roleGroups)}
            </TreeNode>
        ));
    };

    render() {
        const { expandedKeys, autoExpandParent, apps, selectedKey } = this.state;
        const { visible } = this.props;

        return (
            <Modal visible={visible} title="关联更多" onOk={this.submit} onCancel={this.onCancel}>
                {apps.length ? (
                    <>
                        <Search
                            onSearch={this.onSearch}
                            placeholder="搜索应用、角色组、角色"
                            enterButton
                        />
                        <Tree
                            showIcon
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onSelect={this.onSelect}
                            selectedKeys={[selectedKey]}
                            className={styles.linkTree}
                        >
                            {this.renderTree()}
                        </Tree>
                    </>
                ) : (
                    <Empty description={`暂无应用，请到应用管理页新建`} />
                )}
            </Modal>
        );
    }
}

export default SelectRoleDialog;
