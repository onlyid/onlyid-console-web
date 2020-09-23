import React, { PureComponent } from "react";
import { Form, Input, Button, message, TreeSelect, Radio } from "antd";
import http from "my/http";
import { connect } from "react-redux";
import { eventEmitter } from "my/utils";

const { Item } = Form;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

class AddOrEdit extends PureComponent {
    submit = () => {
        const {
            form,
            onSave,
            info,
            resManage: { selectedKey, selectedApp },
            dispatch,
            isTop
        } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            let selectNode = "no";
            let expand = "no";
            // 编辑
            if (info) {
                await http.put("res-nodes/" + info.id, values);
                if (info.parent.id !== values.parentId) expand = "parent";
            }
            // 新增
            else {
                values.clientId = selectedApp.id;
                if (isTop) {
                    values.parentId = -1;
                    selectNode = "last";
                } else {
                    values.parentId = selectedKey;
                    expand = "self";
                }
                await http.post("res-nodes", values);
                dispatch({ type: "resManage/save", payload: { showEmpty: false } });
            }

            message.success("保存成功");
            onSave();
            eventEmitter.emit("resManage/initTree", { selectNode, expand });
        });
    };

    renderTree = node => {
        const {
            resManage: { resNodes, selectedKey }
        } = this.props;

        let children = resNodes.filter(
            item => item.parentId === node.id && String(item.id) !== selectedKey
        );

        return (
            <TreeNode title={node.name} key={String(node.id)} dataRef={node} value={node.id}>
                {children.map(item => this.renderTree(item))}
            </TreeNode>
        );
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;
        const root = { id: -1, name: "根节点" };

        return (
            <Form layout="vertical">
                <Item label="资源名称">
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="资源描述">
                    {getFieldDecorator("description", {
                        initialValue: info && info.description,
                        rules: [{ max: 500, message: "最多输入500字" }]
                    })(<TextArea />)}
                </Item>
                {info && (
                    <Item label="上级资源">
                        {getFieldDecorator("parentId", {
                            initialValue: info.parent.id
                        })(
                            <TreeSelect treeDefaultExpandedKeys={["-1"]}>
                                {this.renderTree(root)}
                            </TreeSelect>
                        )}
                    </Item>
                )}
                <Item label="是否菜单">
                    {getFieldDecorator("isMenu", {
                        initialValue: (info && info.isMenu) || true
                    })(
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    )}
                </Item>
                <Item label="资源 URI">
                    {getFieldDecorator("uri", {
                        initialValue: info && info.uri,
                        rules: [{ max: 500, message: "最多输入500字" }]
                    })(<Input />)}
                </Item>
                <Item>
                    <Button type="primary" onClick={this.submit}>
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 20 }}>
                        取消
                    </Button>
                </Item>
            </Form>
        );
    }
}

export default Form.create()(connect(({ resManage }) => ({ resManage }))(AddOrEdit));
