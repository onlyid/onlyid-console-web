import React, { PureComponent } from "react";
import { Form, Input, Button, message } from "antd";
import http from "my/http";
import { connect } from "react-redux";
import { eventEmitter } from "my/utils";

const { Item } = Form;
const { TextArea } = Input;

class AddOrEdit extends PureComponent {
    submit = () => {
        const {
            form,
            onSave,
            info,
            roleManage: { selectedApp },
            dispatch
        } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            let select = "no";
            // 编辑
            if (info) {
                await http.put("roles/groups/" + info.id, values);
            }
            // 新增
            else {
                values.clientId = selectedApp.id;
                select = "last";
                await http.post("roles/groups", values);
                dispatch({ type: "roleManage/save", payload: { showEmpty: false } });
            }

            message.success("保存成功");
            onSave();
            eventEmitter.emit("roleManage/initTree", { select });
        });
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical">
                <Item label="角色组名称">
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="角色组描述">
                    {getFieldDecorator("description", {
                        initialValue: info && info.description,
                        rules: [{ max: 500, message: "最多输入500字" }]
                    })(<TextArea />)}
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

export default Form.create()(connect(({ roleManage }) => ({ roleManage }))(AddOrEdit));
