import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Table from "components/Table";
import { Button, Drawer, Form, Input, message, Modal, Radio } from "antd";
import http from "my/http";
import NoCard from "components/NoCard";
import { OPERATION_TYPE_TEXT } from "my/constants";

const { Item } = Form;
const { TextArea } = Input;
const { Group } = Radio;

class AddOrEdit1 extends PureComponent {
    submit = () => {
        const {
            form,
            onSave,
            info,
            resManage: { selectedKey }
        } = this.props;

        form.validateFields(async (err, values) => {
            if (err) return;

            values.resId = selectedKey;
            if (info) {
                values.id = info.id;
                await http.put("res-nodes/operations", values);
            } else {
                await http.post("res-nodes/operations", values);
            }

            message.success("保存成功");
            onSave();
        });
    };

    onChange = e => {
        const {
            target: { value }
        } = e;
        const { form } = this.props;

        form.setFieldsValue({ code: value, name: OPERATION_TYPE_TEXT[value] });
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical">
                <Item label="快速填充">
                    <Group onChange={this.onChange}>
                        {Object.keys(OPERATION_TYPE_TEXT).map(key => (
                            <Radio value={key} key={key}>
                                {OPERATION_TYPE_TEXT[key]}
                            </Radio>
                        ))}
                    </Group>
                </Item>
                <Item label="标识">
                    {getFieldDecorator("code", {
                        initialValue: info && info.code,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="名称">
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="描述">
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

const AddOrEdit = Form.create()(connect(({ resManage }) => ({ resManage }))(AddOrEdit1));

class Operation extends PureComponent {
    columns = [
        {
            title: "标识",
            dataIndex: "code"
        },
        {
            title: "名称",
            dataIndex: "name"
        },
        {
            title: "描述",
            dataIndex: "description",
            ellipsis: true
        },
        {
            title: "操作",
            key: "action",
            render: record => {
                return (
                    <>
                        <Button onClick={() => this.showEdit(record)} icon="edit" shape="circle" />
                        <Button
                            onClick={() => this.delete1(record.id)}
                            icon="delete"
                            shape="circle"
                            type="danger"
                            className="buttonPlain"
                            style={{ marginLeft: 10 }}
                        />
                    </>
                );
            }
        }
    ];

    state = {
        list: [],
        loading: true,
        drawerVisible: false,
        info: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const {
            resManage: { selectedKey }
        } = this.props;
        const params = { resId: selectedKey };
        const list = await http.get("res-nodes/operations", { params });

        this.setState({ list, loading: false });
    };

    delete1 = id => {
        Modal.confirm({
            content: "删除后不可恢复，确定删除？",
            okType: "danger",
            onOk: async () => {
                const params = { id };
                await http.delete("res-nodes/operations", { params });

                message.success("删除成功");
                this.initData();
            }
        });
    };

    showEdit = record => {
        this.setState({ drawerVisible: true, info: record });
    };

    showAdd = () => {
        this.setState({ drawerVisible: true, info: null });
    };

    onCancel = () => {
        this.setState({ drawerVisible: false });
    };

    onSave = () => {
        this.setState({ drawerVisible: false });
        this.initData();
    };

    render() {
        const { list, loading, drawerVisible, info } = this.state;

        return (
            <NoCard
                title="操作类型管理"
                right={
                    <Button onClick={this.showAdd} type="primary" icon="plus">
                        新建
                    </Button>
                }
            >
                <Drawer
                    title="新建操作类型"
                    placement="right"
                    onClose={this.onCancel}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit info={info} onSave={this.onSave} onCancel={this.onCancel} />
                </Drawer>
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={this.columns}
                    loading={loading}
                    pagination={false}
                />
            </NoCard>
        );
    }
}

export default connect(({ resManage }) => ({ resManage }))(Operation);
