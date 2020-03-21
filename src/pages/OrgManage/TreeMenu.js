import React, { PureComponent } from "react";
import { Input, Tree } from "antd";
import styles from "./index.module.css";
import { connect } from "react-redux";
import _ from "lodash";
import http from "my/http";
import { eventEmitter } from "my/utils";

const { Search } = Input;
const { TreeNode } = Tree;

class TreeMenu extends PureComponent {
    state = {
        keyword: "",
        expandedKeys: [],
        autoExpandParent: false
    };

    componentDidMount() {
        this.initTree({});
        eventEmitter.on("orgManage/initTree", this.initTree);
    }

    componentWillUnmount() {
        eventEmitter.removeListener("orgManage/initTree", this.initTree);
    }

    initTree = async ({ selectNode = "first", expand = "no" }) => {
        const { expandedKeys } = this.state;
        const {
            orgManage: { selectedKey, orgNodes: prevOrgNodes },
            dispatch
        } = this.props;
        const orgNodes = await http.get("org-nodes");

        let showEmpty = !orgNodes.length;
        dispatch({ type: "orgManage/save", payload: { orgNodes, showEmpty } });

        if (selectNode === "first" || selectNode === "last") {
            let selectedType = null;
            let selectedKey = null;
            if (orgNodes.length) {
                const topNodes = orgNodes.filter(item => item.parentId === -1);
                const node = selectNode === "last" ? _.last(topNodes) : _.head(topNodes);
                selectedType = node.type;
                selectedKey = String(node.id);
            }
            dispatch({
                type: "orgManage/save",
                payload: { selectedKey, selectedType }
            });
        }
        // 规则：先下后上 都无则parent
        else if (selectNode === "neighbor") {
            const parentId = prevOrgNodes.find(item => String(item.id) === selectedKey).parentId;
            const children = prevOrgNodes.filter(item => item.parentId === parentId);
            if (children.length > 1) {
                const index = children.findIndex(item => String(item.id) === selectedKey);
                let newIndex;

                if (index + 1 < children.length) newIndex = index + 1;
                else newIndex = index - 1;

                const newNode = children[newIndex];
                dispatch({
                    type: "orgManage/save",
                    payload: {
                        selectedKey: String(newNode.id),
                        selectedType: newNode.type
                    }
                });
            } else {
                dispatch({
                    type: "orgManage/save",
                    payload: {
                        selectedKey: String(parentId),
                        selectedType: "ORG"
                    }
                });
            }
        }

        if (expand === "self") {
            if (!expandedKeys.includes(selectedKey)) {
                expandedKeys.push(selectedKey);
                dispatch({
                    type: "orgManage/save",
                    payload: {
                        expandedKeys: [...expandedKeys],
                        autoExpandParent: false
                    }
                });
            }
        } else if (expand === "parent") {
            const parentId = String(
                orgNodes.find(item => String(item.id) === selectedKey).parentId
            );
            if (!expandedKeys.includes(parentId)) {
                expandedKeys.push(parentId);
                dispatch({
                    type: "orgManage/save",
                    payload: {
                        expandedKeys: [...expandedKeys],
                        autoExpandParent: false
                    }
                });
            }
        }
    };

    onSearch = keyword => {
        const {
            orgManage: { orgNodes }
        } = this.props;

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

    onSelect = (
        _,
        {
            node: {
                props: { dataRef }
            }
        }
    ) => {
        const { dispatch } = this.props;
        dispatch({
            type: "orgManage/save",
            payload: {
                selectedKey: String(dataRef.id),
                selectedType: dataRef.type
            }
        });
    };

    getTreeTitle = name => {
        const { keyword } = this.state;

        const index = name.indexOf(keyword);
        const beforeStr = name.substr(0, index);
        const afterStr = name.substr(index + keyword.length);

        return index > -1 ? (
            <span>
                {beforeStr}
                <span style={{ color: "#f50" }}>{keyword}</span>
                {afterStr}
            </span>
        ) : (
            <span>{name}</span>
        );
    };

    renderTree = node => {
        const {
            orgManage: { orgNodes }
        } = this.props;

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
                title={this.getTreeTitle(node.name)}
                key={String(node.id)}
                icon={icon}
                dataRef={node}
            >
                {children.map(item => this.renderTree(item))}
            </TreeNode>
        );
    };

    render() {
        const {
            orgManage: { selectedKey }
        } = this.props;
        const { expandedKeys, autoExpandParent } = this.state;
        const root = { id: -1 };

        console.log(expandedKeys);

        return (
            <div className={styles.treeMenu}>
                <Search onSearch={this.onSearch} placeholder="搜索组织机构树" enterButton />
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

export default connect(({ orgManage }) => ({ orgManage }))(TreeMenu);
