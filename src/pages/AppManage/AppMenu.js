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
        searchList: [],
        keyword: ""
    };

    componentDidMount() {
        this.initData();
        eventEmitter.on("appManage/initAppMenu", this.initData);
    }

    componentWillUnmount() {
        eventEmitter.off("appManage/initAppMenu", this.initData);
    }

    initData = async selectLast => {
        const { onShowEmptyChange, dispatch } = this.props;

        const list = await http.get("clients");
        this.setState({ list });

        if (list.length) {
            const selectedKey = selectLast ? _.last(list).id : list[0].id;
            dispatch({ type: "appManage/save", payload: { selectedKey } });
        }

        onShowEmptyChange(!list.length);
    };

    onItemClick = id => {
        const { dispatch } = this.props;
        dispatch({ type: "appManage/save", payload: { selectedKey: id } });
    };

    onSearch = keyword => {
        const { list } = this.state;
        const { dispatch } = this.props;

        if (keyword) {
            const searchList = list.filter(item => item.name.includes(keyword));
            this.setState({ keyword, searchList });

            if (searchList.length) {
                dispatch({
                    type: "appManage/save",
                    payload: { selectedKey: searchList[0].id }
                });
            }
        } else {
            this.setState({ keyword: "" });
        }
    };

    render() {
        const { list, searchList, keyword } = this.state;
        const {
            appManage: { selectedKey }
        } = this.props;

        const displayList = keyword ? searchList : list;

        return (
            <div className={styles.appMenu}>
                <Search onSearch={this.onSearch} placeholder="搜索应用名称" enterButton />
                <div className={styles.appMenuBox}>
                    {displayList.map(item => (
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
