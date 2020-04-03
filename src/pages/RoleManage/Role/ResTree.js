import React, { PureComponent } from "react";
import http from "my/http";
import { connect } from "react-redux";
import { Input, Tree } from "antd";
import TreeNodeTitle from "components/TreeNodeTitle";
import styles from "../index.module.css";
import classNames from "classnames";
import { eventEmitter } from "my/utils";

const { Search } = Input;
const { TreeNode } = Tree;

class ResTree extends PureComponent {
    state = {
        nodes: [],
        keyword: "",
        expandedKeys: [],
        autoExpandParent: false
    };

    componentDidMount() {
        eventEmitter.on("roleManage/checkSelectedRes", this.checkSelected);
        this.initTree();
    }

    componentWillUnmount() {
        eventEmitter.off("roleManage/checkSelectedRes", this.checkSelected);
    }

    initTree = async () => {
        const {
            roleManage: { selectedApp },
            onSelect,
            onShowEmpty
        } = this.props;

        const params = { clientId: selectedApp.id };
        const nodes = await http.get("res-nodes", { params });
        this.setState({ nodes });

        if (!nodes.length) {
            onShowEmpty();
            return;
        }

        const firstNode = nodes.find(item => item.parentId === -1);
        onSelect(firstNode.id);
    };

    onSearch = keyword => {
        const { nodes } = this.state;

        if (keyword) {
            const expandedKeys = nodes
                .filter(({ name }) => name.includes(keyword))
                .map(item => String(item.parentId));

            this.setState({ keyword, expandedKeys, autoExpandParent: true });
        } else {
            this.setState({ keyword: "", expandedKeys: [], autoExpandParent: false });
        }
    };

    onExpand = expandedKeys => {
        this.setState({ expandedKeys, autoExpandParent: false });
    };

    onSelect = (
        _,
        {
            node: {
                props: { dataRef }
            }
        }
    ) => {
        const { onSelect } = this.props;
        onSelect(dataRef.id);
    };

    onCheck = (
        _,
        {
            checked,
            node: {
                props: { dataRef }
            }
        }
    ) => {
        this.actualCheck(dataRef, checked);
    };

    // 勾选操作类型时触发
    checkSelected = () => {
        const { checkedKeys, selectedKey } = this.props;
        const { nodes } = this.state;

        if (checkedKeys.includes(selectedKey)) return;

        const node = nodes.find(item => String(item.id) === selectedKey);
        this.actualCheck(node, true);
    };

    actualCheck = (node, checked) => {
        const { onCheck, checkedKeys, recursiveCheck } = this.props;
        const { nodes } = this.state;

        onCheck(node.id, checked);

        if (checked) {
            // 勾选节点时 要递归选中父节点
            let parent = nodes.find(item => item.id === node.parentId);
            while (parent) {
                if (!checkedKeys.includes(String(parent.id))) onCheck(parent.id, true);
                // eslint-disable-next-line no-loop-func
                parent = nodes.find(item => item.id === parent.parentId);
            }

            // 如果recursiveCheck模式打开 则也要递归选中子节点
            if (recursiveCheck) {
                const f = node => {
                    const children = nodes.filter(item => item.parentId === node.id);
                    if (!children.length) return;

                    children.forEach(item => {
                        if (!checkedKeys.includes(String(item.id))) onCheck(item.id, true);
                        f(item);
                    });
                };

                f(node);
            }
        }
        // 取消勾选时 要把子节点递归取消
        else {
            const f = node => {
                const children = nodes.filter(item => item.parentId === node.id);
                if (!children.length) return;

                children.forEach(item => {
                    if (checkedKeys.includes(String(item.id))) {
                        onCheck(item.id, false);
                        f(item);
                    }
                });
            };

            f(node);
        }
    };

    renderTree = node => {
        const { keyword, nodes } = this.state;

        const children = nodes.filter(item => item.parentId === node.id);

        if (node.id === -1) return children.map(item => this.renderTree(item));

        return (
            <TreeNode
                title={<TreeNodeTitle title={node.name} keyword={keyword} />}
                key={String(node.id)}
                icon={<i className="material-icons">category</i>}
                dataRef={node}
            >
                {children.map(item => this.renderTree(item))}
            </TreeNode>
        );
    };

    render() {
        const { expandedKeys, autoExpandParent } = this.state;
        const { selectedKey, checkedKeys } = this.props;
        const root = { id: -1 };

        return (
            <div className={classNames("treeMenu", styles.treeMenu)}>
                <Search onSearch={this.onSearch} placeholder="搜索资源树" enterButton />
                <Tree
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={this.onSelect}
                    selectedKeys={[selectedKey]}
                    checkable
                    checkStrictly
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                >
                    {this.renderTree(root)}
                </Tree>
            </div>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(ResTree);
