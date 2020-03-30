import React, { PureComponent } from "react";
import { Empty, Input, message, Modal, Tree } from "antd";
import http from "my/http";
import styles from "./index.module.css";
import { TYPE_LABEL } from "my/constants";
import { connect } from "react-redux";
import TreeNodeTitle from "../../components/TreeNodeTitle";

const { Search } = Input;
const { TreeNode } = Tree;

class TreeLinkDialog extends PureComponent {
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

    // 过滤掉构建树不需要的节点
    filter = (orgNodes, type) => {
        const list = orgNodes.filter(item => item.type === type);
        const orgs = orgNodes.filter(item => item.type === "ORG");
        const newOrgs = [];

        for (const item of list) {
            let node = item;
            while (node.parentId !== -1) {
                // eslint-disable-next-line no-loop-func
                const parent = orgs.find(o => o.id === node.parentId);
                if (newOrgs.findIndex(no => no.id === parent.id) < 0) newOrgs.push(parent);

                node = parent;
            }
        }

        newOrgs.sort((a, b) => {
            if (a.createDate > b.createDate) return 1;
            else return -1;
        });

        return [...newOrgs, ...list];
    };

    initData = async () => {
        const { type } = this.props;
        let orgNodes = await http.get("org-nodes");

        if (type === "ORG") {
            orgNodes = orgNodes.filter(item => item.type === "ORG");
        } else {
            // POSITION, USER_GROUP
            orgNodes = this.filter(orgNodes, type);
        }
        this.setState({ orgNodes });
    };

    submit = async () => {
        const { selectedKey: orgNodeId } = this.state;
        const {
            onClose,
            type,
            userPool: { selectedKey: userId }
        } = this.props;

        if (!orgNodeId) {
            message.warn(`请选择一个${TYPE_LABEL[type]}`);
            return;
        }

        await http.post("org-nodes/link-user", { userId, orgNodeId });

        message.success("保存成功");
        this.setState({ selectedKey: null });
        onClose(true);
    };

    cancel = () => {
        this.setState({ selectedKey: null });
        const { onClose } = this.props;
        onClose();
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
        const { visible, type } = this.props;
        const root = { id: -1 };

        return (
            <Modal visible={visible} title="关联更多" onOk={this.submit} onCancel={this.cancel}>
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
                    <Empty description={`暂无${TYPE_LABEL[type]}，请到组织机构页新建`} />
                )}
            </Modal>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(TreeLinkDialog);
