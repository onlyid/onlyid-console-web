import React, { PureComponent } from "react";
import http from "my/http";
import styles from "./index.module.css";
import classNames from "classnames";
import { connect } from "react-redux";
import { eventEmitter } from "my/utils";
import _ from "lodash";
import { Input } from "antd";

const { Search } = Input;

class AppMenu extends PureComponent {
    state = {
        list: [],
        keyword: ""
    };

    componentDidMount() {
        this.initData();
        eventEmitter.on("appManage/initAppMenu", this.initData);
        eventEmitter.on("appManage/deleteSelected", this.deleteSelected);
    }

    componentWillUnmount() {
        eventEmitter.off("appManage/initAppMenu", this.initData);
        eventEmitter.off("appManage/deleteSelected", this.deleteSelected);
    }

    initData = async (select = "first") => {
        const { onShowEmptyChange, dispatch } = this.props;
        const { keyword } = this.state;

        const params = { keyword };
        const list = await http.get("clients", { params });
        this.setState({ list });

        if (list.length && select !== "no") {
            const selectedKey = select === "last" ? _.last(list).id : list[0].id;
            dispatch({ type: "appManage/save", payload: { selectedKey } });
        }

        onShowEmptyChange(!list.length);
    };

    deleteSelected = () => {
        const {
            appManage: { selectedKey },
            onShowEmptyChange,
            dispatch
        } = this.props;
        const { list } = this.state;

        if (list.length === 1) {
            onShowEmptyChange(true);
            return;
        }

        const index = list.findIndex(item => item.id === selectedKey);
        let newIndex;

        if (index === list.length - 1) newIndex = index - 1;
        else newIndex = index; // 删掉后 新的会移到原来的位置

        list.splice(index, 1);
        this.setState({ list: [...list] });

        dispatch({ type: "appManage/save", payload: { selectedKey: list[newIndex].id } });
    };

    onItemClick = id => {
        const { dispatch } = this.props;
        dispatch({ type: "appManage/save", payload: { selectedKey: id } });
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    render() {
        const { list } = this.state;
        const {
            appManage: { selectedKey }
        } = this.props;

        return (
            <div className={styles.appMenu}>
                <Search onSearch={this.onSearch} placeholder="搜索应用名称" enterButton />
                <div className={styles.appMenuBox}>
                    {list.map(item => (
                        <div
                            className={classNames(styles.appItem, {
                                [styles.active]: selectedKey === item.id
                            })}
                            onClick={() => this.onItemClick(item.id)}
                            key={item.id}
                        >
                            <img src={item.iconUrl} alt="icon" />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default connect(({ appManage }) => ({ appManage }))(AppMenu);
