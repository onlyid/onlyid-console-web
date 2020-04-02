import React, { PureComponent } from "react";
import { Input, Tree } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import http from "my/http";
import { eventEmitter } from "my/utils";
import TreeNodeTitle from "components/TreeNodeTitle";

const { Search } = Input;
const { TreeNode } = Tree;

class TreeMenu extends PureComponent {
    state = {
        list: [],
        keyword: "",
        expandedKeys: [],
        autoExpandParent: false
    };

    componentDidMount() {
        this.initTree({});
        eventEmitter.on("roleManage/initTree", this.initTree);
    }

    componentWillUnmount() {
        eventEmitter.removeListener("roleManage/initTree", this.initTree);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            roleManage: { selectedApp }
        } = this.props;
        if (selectedApp !== prevProps.roleManage.selectedApp) this.initTree({});
    }

    initTree = async ({ select = "first", expand = "no" }) => {
        const { expandedKeys, list: prevList } = this.state;
        const {
            roleManage: { selectedKey, selectedApp, groupId },
            dispatch
        } = this.props;

        if (!selectedApp) return;

        const params = { clientId: selectedApp.id };
        const list = await http.get("roles/groups", { params });

        const showEmpty = !list.length;
        dispatch({ type: "roleManage/save", payload: { showEmpty } });
        this.setState({ list });

        if (showEmpty) return;

        if (select === "first" || select === "last") {
            const group = select === "first" ? _.head(list) : _.last(list);
            dispatch({
                type: "roleManage/save",
                payload: { selectedKey: String(group.id), groupId: null }
            });
        }
        // 规则：先下后上 都无则parent
        else if (select === "neighbor") {
            // 当前选中的是角色
            if (groupId) {
                const group = prevList.find(item => item.id === groupId);
                // 只有一个元素 删了就跳回父
                if (group.roles.length === 1) {
                    dispatch({
                        type: "roleManage/save",
                        payload: { selectedKey: String(group.id), groupId: null }
                    });
                } else {
                    let index = group.roles.findIndex(item => String(item.id) === selectedKey);
                    // 如果是最后一个 取前一个 否则取后一个
                    if (index === group.roles.length - 1) index--;
                    else index++;

                    const role = group.roles[index];
                    dispatch({
                        type: "roleManage/save",
                        payload: { selectedKey: String(role.id), groupId: group.id }
                    });
                }
            }
            // 当前选中的是角色组
            else {
                let index = prevList.findIndex(item => String(item.id) === selectedKey);
                // 如果是最后一个 取前一个 否则取后一个
                if (index === prevList.length - 1) index--;
                else index++;

                const group = prevList[index];
                dispatch({
                    type: "roleManage/save",
                    payload: { selectedKey: String(group.id), groupId: null }
                });
            }
        }

        if (expand !== "no") {
            let key;
            if (expand === "self") key = "g" + selectedKey;
            else key = "g" + groupId; // expand == parent

            if (!expandedKeys.includes(key)) {
                expandedKeys.push(key);
                this.setState({ expandedKeys: [...expandedKeys], autoExpandParent: false });
            }
        }
    };

    onSearch = keyword => {
        const { list } = this.state;

        if (keyword) {
            const expandedKeys = [];
            for (const { roles } of list) {
                const keys = roles
                    .filter(({ name }) => name.includes(keyword))
                    .map(item => "g" + item.groupId);
                expandedKeys.push(...new Set(keys));
            }
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
        dispatch({
            type: "roleManage/save",
            payload: { selectedKey: String(dataRef.id), groupId: dataRef.groupId }
        });
    };

    renderTree = () => {
        const { keyword, list } = this.state;

        return list.map(group => (
            <TreeNode
                title={<TreeNodeTitle title={group.name} keyword={keyword} />}
                key={"g" + group.id}
                icon={<i className="material-icons">folder_shared</i>}
                dataRef={group}
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

    render() {
        const {
            roleManage: { selectedKey, groupId }
        } = this.props;
        const { expandedKeys, autoExpandParent } = this.state;

        console.log(expandedKeys);

        const selectedKeys = groupId ? [selectedKey] : ["g" + selectedKey];

        return (
            <div className="treeMenu">
                <Search onSearch={this.onSearch} placeholder="搜索角色、角色组" enterButton />
                <Tree
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={this.onSelect}
                    selectedKeys={selectedKeys}
                >
                    {this.renderTree()}
                </Tree>
            </div>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(TreeMenu);
