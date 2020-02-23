import React, { PureComponent } from "react";
import classNames from "classnames";
import styles from "./index.module.css";
import http from "../../http";
import Table from "../../components/Table";
import { Button, Drawer, Empty, Input } from "antd";
import { connect } from "react-redux";
import User from "./User";
import { GENDER_TEXT } from "../../constants";
import ReactDOM from "react-dom";
import AddOrEdit from "./AddOrEdit";
import Avatar from "../../components/Avatar";
import { eventEmitter } from "../../utils";

const { Search } = Input;

class UserPool extends PureComponent {
    columns = [
        {
            title: "头像",
            dataIndex: "avatarUrl",
            render: value => <Avatar url={value} width={40} />,
            mustShow: true
        },
        {
            title: "昵称",
            dataIndex: "nickname",
            mustShow: true
        },
        {
            title: "手机号",
            dataIndex: "mobile"
        },
        {
            title: "邮箱",
            dataIndex: "email"
        },
        {
            title: "性别",
            dataIndex: "gender",
            render: value => GENDER_TEXT[value] || "-"
        },
        {
            title: "操作",
            dataIndex: "id",
            render: value => (
                <Button
                    onClick={() => this.onAction(value)}
                    icon="arrow-right"
                    shape="circle"
                    type="primary"
                />
            ),
            mustShow: true
        }
    ];

    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        keyword: "",
        loading: true,
        drawerVisible: false
    };

    componentDidMount() {
        this.initData();
        eventEmitter.on("userPool/refresh", this.refresh);

        const { dispatch } = this.props;
        dispatch({ type: "userPool/save", payload: { selectedKey: null } });
    }

    componentWillUnmount() {
        eventEmitter.removeListener("userPool/refresh", this.refresh);
    }

    refresh = async selectNew => {
        const {
            dispatch,
            userPool: { selectedKey }
        } = this.props;
        const { list: prevList } = this.state;

        await this.initData();

        if (selectNew) {
            let newKey = null;
            if (prevList.length > 1) {
                let index = prevList.findIndex(item => item.id === selectedKey);

                if (index + 1 < prevList.length) index++;
                else index--;

                newKey = prevList[index].id;
            }
            dispatch({
                type: "userPool/save",
                payload: { selectedKey: newKey }
            });
        }
    };

    initData = async () => {
        this.setState({ loading: true });

        const { current, pageSize, keyword } = this.state;
        const params = { current, pageSize, keyword };

        const { list, total } = await http.get("users", { params });

        if (list.length || current === 1) this.setState({ list, total, loading: false });
        else this.setState({ current: current - 1 }, this.initData);
    };

    onAction = id => {
        const { dispatch } = this.props;
        dispatch({ type: "userPool/save", payload: { selectedKey: id } });
    };

    onChange = pagination => {
        this.setState({ ...pagination }, this.initData);
    };

    onSearch = keyword => {
        this.setState({ keyword, current: 1 }, this.initData);
    };

    showAdd = () => {
        this.setState({ drawerVisible: true });
    };

    closeAdd = () => {
        this.setState({ drawerVisible: false });
    };

    onUserAdd = () => {
        const { total, pageSize } = this.state;
        const { dispatch } = this.props;

        this.setState({
            drawerVisible: false,
            current: Math.ceil((total + 1) / pageSize)
        });
        dispatch({ type: "userPool/save", payload: { selectedKey: null } });
        this.initData();
    };

    render() {
        const { list, current, pageSize, total, loading, drawerVisible } = this.state;
        const {
            userPool: { selectedKey }
        } = this.props;

        const pagination = { current, pageSize, total };

        const columns = selectedKey ? this.columns.filter(item => item.mustShow) : this.columns;

        const portalNode = window.document.getElementById("headerPortal");

        const createNew = (
            <Button onClick={this.showAdd} icon="plus" type="primary">
                新建用户
            </Button>
        );

        const left =
            list.length || loading ? (
                <div className={styles.left}>
                    <Search
                        onSearch={this.onSearch}
                        placeholder="搜索昵称、手机号、邮箱"
                        enterButton
                        style={{ marginBottom: 20 }}
                    />
                    <Table
                        rowKey="id"
                        dataSource={list}
                        columns={columns}
                        pagination={selectedKey ? false : pagination}
                        loading={loading}
                        onChange={this.onChange}
                        rowClassName={({ id }) => id === selectedKey && styles.selectedRow}
                    />
                </div>
            ) : (
                <div className="emptyBox">
                    <Empty description="暂无用户，请新建">{createNew}</Empty>
                </div>
            );

        return (
            <div
                className={classNames(styles.userPool, {
                    [styles.userVisible]: selectedKey
                })}
            >
                {portalNode && ReactDOM.createPortal(createNew, portalNode)}
                <Drawer
                    title="新建用户"
                    placement="right"
                    onClose={this.closeAdd}
                    visible={drawerVisible}
                    maskClosable={false}
                    width="600"
                    destroyOnClose
                >
                    <AddOrEdit onSave={this.onUserAdd} onCancel={this.closeAdd} />
                </Drawer>
                {left}
                {selectedKey && <User />}
            </div>
        );
    }
}

export default connect(({ userPool }) => ({ userPool }))(UserPool);
