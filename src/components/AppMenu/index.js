import React, { PureComponent } from "react";
import http from "my/http";
import styles from "./index.module.css";
import classNames from "classnames";
import { eventEmitter } from "my/utils";
import _ from "lodash";
import { Input } from "antd";
import { CLIENT_TYPE_TEXT } from "my/constants";
import statisticsIcon from "assets/statistics-icon.png";

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
        const { onShowEmptyChange, savePayload, showAll } = this.props;
        const { keyword } = this.state;

        const params = { keyword };
        const list = await http.get("clients", { params });
        this.setState({ list });

        if (list.length && select !== "no") {
            if (showAll) list.unshift({ id: "all", iconUrl: statisticsIcon, name: "所有应用" });

            const selectedKey = select === "last" ? _.last(list).id : list[0].id;
            savePayload({ selectedKey });
        }

        onShowEmptyChange(!list.length);
    };

    deleteSelected = () => {
        const { selectedKey, onShowEmptyChange, savePayload } = this.props;
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

        savePayload({ selectedKey: list[newIndex].id });
    };

    onItemClick = id => {
        const { savePayload } = this.props;
        savePayload({ selectedKey: id });
    };

    onSearch = keyword => {
        this.setState({ keyword }, this.initData);
    };

    render() {
        const { list } = this.state;
        const { selectedKey } = this.props;

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
                            <div>
                                <img src={item.iconUrl} alt="icon" />
                                <span>{item.name}</span>
                            </div>
                            <span className={styles.type}>
                                {CLIENT_TYPE_TEXT[item.type] || "所有"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default AppMenu;
