import React, { PureComponent } from "react";
import { Form, Input, Button, message, Select } from "antd";
import http from "my/http";
import { connect } from "react-redux";
import { eventEmitter } from "my/utils";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

class AddOrEdit extends PureComponent {
    state = {
        list: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            roleManage: { selectedApp },
            info
        } = this.props;
        if (info) {
            const params = { clientId: selectedApp.id };
            const list = await http.get("roles/groups", { params });
            this.setState({ list });
        }
    };

    submit = () => {
        const {
            form,
            onSave,
            info,
            roleManage: { selectedKey },
            dispatch
        } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            let expand = "no";
            // 编辑
            if (info) {
                await http.put("roles/" + info.id, values);
                if (info.group.id !== values.groupId) {
                    expand = "parent";
                    dispatch({ type: "roleManage/save", payload: { groupId: values.groupId } });
                }
            }
            // 新增
            else {
                values.groupId = selectedKey;
                expand = "self";
                await http.post("roles", values);
            }

            message.success("保存成功");
            onSave();
            eventEmitter.emit("roleManage/initTree", { expand, select: "no" });
        });
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;
        const { list } = this.state;

        return (
            <Form layout="vertical">
                <Item label="角色名称">
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="角色描述">
                    {getFieldDecorator("description", {
                        initialValue: info && info.description,
                        rules: [{ max: 500, message: "最多输入500字" }]
                    })(<TextArea />)}
                </Item>
                {info && (
                    <Item label="所属角色组">
                        {getFieldDecorator("groupId", {
                            initialValue: info.group.id
                        })(
                            <Select>
                                {list.map(group => (
                                    <Option key={String(group.id)} value={group.id}>
                                        {group.name}
                                    </Option>
                                ))}
                            </Select>
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

export default Form.create()(connect(({ roleManage }) => ({ roleManage }))(AddOrEdit));
