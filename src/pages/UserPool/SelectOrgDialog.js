import React, { PureComponent } from "react";
import { Empty, Input, message, Modal, Tree } from "antd";
import http from "my/http";
import styles from "./index.module.css";
import TreeNodeTitle from "components/TreeNodeTitle";

const { Search } = Input;
const { TreeNode } = Tree;

class SelectOrgDialog extends PureComponent {
    state = {
        expandedKeys: [],
        autoExpandParent: false,
        orgNodes: [],
        keyword: "",
        selectedKey: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const orgNodes = await http.get("org-nodes");
        this.setState({ orgNodes });
    };

    submit = async () => {
        const { selectedKey } = this.state;
        const { onSelect } = this.props;

        if (!selectedKey) {
            message.warn("请选择一个机构/岗位/用户组");
            return;
        }

        onSelect(selectedKey);
        this.setState({ selectedKey: null });
    };

    onCancel = () => {
        this.setState({ selectedKey: null });
        const { onCancel } = this.props;
        onCancel();
    };

    onSearch = keyword => {
        const { orgNodes } = this.state;

        if (keyword) {
            const expandedKeys = orgNodes
                .filter(({ name }) => name.includes(keyword))
                .map(item => String(item.id));

            this.setState({ keyword, expandedKeys, autoExpandParent: true });
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

    renderTree = node => {
        const { orgNodes, keyword } = this.state;

        const children = orgNodes.filter(item => item.parentId === node.id);

        if (node.id === -1) return children.map(item => this.renderTree(item));

        let icon;
        switch (node.type) {
            case "ORG":
                icon = <i className="material-icons">business</i>;
                break;
            case "POSITION":
                icon = <i className="material-icons">desktop_windows</i>;
                break;
            default:
                // 'USER_GROUP'
                icon = <i className="material-icons">group</i>;
        }

        return (
            <TreeNode
                title={<TreeNodeTitle title={node.name} keyword={keyword} />}
                key={String(node.id)}
                icon={icon}
                dataRef={node}
            >
                {children.map(item => this.renderTree(item))}
            </TreeNode>
        );
    };

    render() {
        const { expandedKeys, autoExpandParent, orgNodes, selectedKey } = this.state;
        const { visible } = this.props;
        const root = { id: -1 };

        return (
            <Modal visible={visible} title="关联更多" onOk={this.submit} onCancel={this.onCancel}>
                {orgNodes.length ? (
                    <>
                        <Search onSearch={this.onSearch} placeholder="搜索组织机构树" enterButton />
                        <Tree
                            showIcon
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onSelect={this.onSelect}
                            selectedKeys={[selectedKey]}
                            className={styles.linkTree}
                        >
                            {this.renderTree(root)}
                        </Tree>
                    </>
                ) : (
                    <Empty description={`暂无组织机构，请到组织机构页新建`} />
                )}
            </Modal>
        );
    }
}

export default SelectOrgDialog;
