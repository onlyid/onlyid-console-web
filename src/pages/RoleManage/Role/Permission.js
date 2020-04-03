import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Empty, Icon, message, Tooltip } from "antd";
import styles from "../index.module.css";
import OperList from "./OperList";
import ResTree from "./ResTree";
import http from "my/http";

class Permission extends PureComponent {
    state = {
        currentId: null,
        recursiveCheck: true,
        permission: [],
        showEmpty: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            roleManage: { selectedKey }
        } = this.props;

        const permission = await http.get(`roles/${selectedKey}/res-links`);
        this.setState({ permission });
    };

    submit = async () => {
        const {
            roleManage: { selectedKey },
            onClose
        } = this.props;
        const { permission } = this.state;
        console.log(permission);

        await http.post(`roles/${selectedKey}/res-links`, permission);
        message.success("保存成功");
        onClose();
    };

    toggleRecursive = e => {
        this.setState({ recursiveCheck: e.target.checked });
    };

    onSelect = currentId => {
        this.setState({ currentId });
    };

    onResCheck = (resId, checked) => {
        const { permission } = this.state;
        if (checked) {
            permission.push({ resId, operIds: [] });
        } else {
            const index = permission.findIndex(item => item.resId === resId);
            permission.splice(index, 1);
        }
        this.setState({ permission: [...permission] });
    };

    onOperCheck = keys => {
        const { currentId, permission } = this.state;
        const res = permission.find(item => item.resId === currentId);
        res.operIds = keys;
        this.forceUpdate();
    };

    render() {
        const { onClose } = this.props;
        const { currentId, recursiveCheck, permission, showEmpty } = this.state;

        // resCheckedKeys是string类型（tree组件要求） operCheckedKeys则是number类型
        const resCheckedKeys = permission.map(item => String(item.resId));
        const res = permission.find(item => item.resId === currentId);
        const operCheckedKeys = res ? res.operIds : [];

        if (showEmpty) {
            return (
                <Empty style={{ marginTop: 40 }} description="暂无权限数据，请到权限管理页新建" />
            );
        }

        return (
            <div className={styles.permission}>
                <ResTree
                    onSelect={this.onSelect}
                    selectedKey={String(currentId)}
                    recursiveCheck={recursiveCheck}
                    onCheck={this.onResCheck}
                    checkedKeys={resCheckedKeys}
                    onShowEmpty={() => this.setState({ showEmpty: true })}
                />
                <div className={styles.right}>
                    <span>操作类型：</span>
                    <OperList
                        resId={currentId}
                        checkedKeys={operCheckedKeys}
                        onCheck={this.onOperCheck}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Checkbox defaultChecked onChange={this.toggleRecursive}>
                            资源树递归勾选
                        </Checkbox>
                        <Tooltip title="勾选父节点时，自动勾选所有子节点">
                            <Icon type="question-circle" />
                        </Tooltip>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Button type="primary" onClick={this.submit}>
                            保存
                        </Button>
                        <Button onClick={onClose} style={{ marginLeft: 20 }}>
                            取消
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ roleManage }) => ({ roleManage }))(Permission);
