import React, { PureComponent } from "react";
import { Input, Tree } from "antd";
import styles from "./index.module.css";
import { connect } from "react-redux";
import _ from "lodash";
import http from "my/http";
import { eventEmitter } from "my/utils";
import TreeNodeTitle from "components/TreeNodeTitle";

const { Search } = Input;
const { TreeNode } = Tree;

class TreeMenu extends PureComponent {
    state = {
        keyword: "",
        expandedKeys: [],
        autoExpandParent: false
    };

    componentDidMount() {
        eventEmitter.on("resManage/initTree", this.initTree);
    }

    componentWillUnmount() {
        eventEmitter.removeListener("resManage/initTree", this.initTree);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            resManage: { selectedApp }
        } = this.props;
        if (selectedApp !== prevProps.resManage.selectedApp) this.initTree({});
    }

    initTree = async ({ selectNode = "first", expand = "no" }) => {
        const { expandedKeys } = this.state;
        const {
            resManage: { selectedKey, resNodes: prevResNodes, selectedApp },
            dispatch
        } = this.props;

        const params = { clientId: selectedApp.id };
        const resNodes = await http.get("res-nodes", { params });

        let showEmpty = !resNodes.length;
        dispatch({ type: "resManage/save", payload: { resNodes, showEmpty } });

        if (selectNode === "first" || selectNode === "last") {
            let selectedKey = null;
            if (resNodes.length) {
                const topNodes = resNodes.filter(item => item.parentId === -1);
                const node = selectNode === "last" ? _.last(topNodes) : _.head(topNodes);
                selectedKey = String(node.id);
            }
            dispatch({ type: "resManage/save", payload: { selectedKey } });
        }
        // 规则：先下后上 都无则parent
        else if (selectNode === "neighbor") {
            const parentId = prevResNodes.find(item => String(item.id) === selectedKey).parentId;
            const children = prevResNodes.filter(item => item.parentId === parentId);
            if (children.length > 1) {
                const index = children.findIndex(item => String(item.id) === selectedKey);
                let newIndex;

                if (index + 1 < children.length) newIndex = index + 1;
                else newIndex = index - 1;

                const newNode = children[newIndex];
                dispatch({ type: "resManage/save", payload: { selectedKey: String(newNode.id) } });
            } else {
                dispatch({ type: "resManage/save", payload: { selectedKey: String(parentId) } });
            }
        }

        if (expand === "self") {
            if (!expandedKeys.includes(selectedKey)) {
                expandedKeys.push(selectedKey);
                this.setState({ expandedKeys: [...expandedKeys], autoExpandParent: false });
            }
        } else if (expand === "parent") {
            const node = resNodes.find(item => String(item.id) === selectedKey);
            const parentId = String(node.parentId);
            if (!expandedKeys.includes(parentId)) {
                expandedKeys.push(parentId);
                this.setState({ expandedKeys: [...expandedKeys], autoExpandParent: false });
            }
        }
    };

    onSearch = keyword => {
        const {
            resManage: { resNodes }
        } = this.props;

        if (keyword) {
            const expandedKeys = resNodes
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
        const { dispatch } = this.props;
        dispatch({ type: "resManage/save", payload: { selectedKey: String(dataRef.id) } });
    };

    renderTree = node => {
        const {
            resManage: { resNodes }
        } = this.props;
        const { keyword } = this.state;

        const children = resNodes.filter(item => item.parentId === node.id);

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
        const {
            resManage: { selectedKey }
        } = this.props;
        const { expandedKeys, autoExpandParent } = this.state;
        const root = { id: -1 };

        console.log(expandedKeys);

        return (
            <div className={styles.treeMenu}>
                <Search onSearch={this.onSearch} placeholder="搜索权限树" enterButton />
                <Tree
                    showIcon
                    className={styles.tree}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={this.onSelect}
                    selectedKeys={[selectedKey]}
                >
                    {this.renderTree(root)}
                </Tree>
            </div>
        );
    }
}

export default connect(({ resManage }) => ({ resManage }))(TreeMenu);
