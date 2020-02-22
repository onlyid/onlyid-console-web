// 维护提示：info存在 则为编辑 否则为新增 新增通过type来确定新增的类型

import React, { PureComponent } from "react";
import { Form, Input, Button, message, TreeSelect } from "antd";
import http from "../../http";
import { TYPE_LABEL } from "../../constants";
import { connect } from "react-redux";
import { eventEmitter } from "../../utils";

const { Item } = Form;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

class AddOrEdit extends PureComponent {
    submit = () => {
        const {
            form,
            onSave,
            info,
            type,
            orgManage: { selectedKey }
        } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            let selectNode = "no";
            let expand = "no";
            // 编辑
            if (info) {
                await http.put("org-nodes/" + info.id, values);
                if (info.parent.id !== values.parentId) expand = "parent";
            }
            // 新增
            else {
                if (type === "TOP_ORG") {
                    values.type = "ORG";
                    values.parentId = -1;
                    selectNode = "last";
                } else {
                    values.type = type;
                    values.parentId = selectedKey;
                    expand = "self";
                }
                await http.post("org-nodes", values);
            }

            message.success("保存成功");
            onSave();
            eventEmitter.emit("orgManage/initTree", { selectNode, expand });
        });
    };

    renderTree = node => {
        const {
            orgManage: { orgNodes },
            info
        } = this.props;

        const children = orgNodes.filter(
            item => item.parentId === node.id && item.type === "ORG"
        );

        // 岗位和用户组节点 无需展示根节点
        if (info.type !== "ORG" && node.id === -1)
            return children.map(item => this.renderTree(item));

        return (
            <TreeNode
                title={node.name}
                key={String(node.id)}
                dataRef={node}
                value={node.id}
            >
                {children.map(item => this.renderTree(item))}
            </TreeNode>
        );
    };

    render() {
        const { onCancel, form, info, type } = this.props;
        const { getFieldDecorator } = form;
        const root = { id: -1, name: "根节点" };

        const typeLabel = TYPE_LABEL[type || info.type];

        return (
            <Form layout="vertical">
                <Item label={`${typeLabel}名称`}>
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "不能超过50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label={`${typeLabel}描述`}>
                    {getFieldDecorator("description", {
                        initialValue: info && info.description,
                        rules: [{ max: 500, message: "不能超过500字" }]
                    })(<TextArea />)}
                </Item>
                {info && (
                    <Item label="上级组织机构">
                        {getFieldDecorator("parentId", {
                            initialValue: info.parent.id
                        })(
                            <TreeSelect treeDefaultExpandedKeys={["-1"]}>
                                {this.renderTree(root)}
                            </TreeSelect>
                        )}
                    </Item>
                )}
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

export default Form.create()(
    connect(({ orgManage }) => ({ orgManage }))(AddOrEdit)
);
