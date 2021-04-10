import React, { PureComponent } from "react";
import http from "my/http";
import { withRouter } from "react-router-dom";
import Empty from "components/Empty";
import styles from "./Permission.module.css";
import { Button, Checkbox, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import MyTable from "components/MyTable";
import { eventEmitter } from "my/utils";

class Permission extends PureComponent {
    state = {
        list: [],
        loading: true,
        checkedIds: []
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { clientId, match } = this.props;

        let params = { clientId };
        const list = await http.get("permissions", { params });
        params = { roleId: match.params.id };
        const checkedIds = await http.get("permissions/by-role", { params });

        this.setState({ list, checkedIds, loading: false });
    };

    onSubmit = async () => {
        const { match, clientId } = this.props;
        const { checkedIds } = this.state;

        const params = { clientId, permissions: checkedIds };
        await http.post(`roles/${match.params.id}/permissions`, params);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    onCheck = ({ target: { checked } }, id) => {
        const { checkedIds } = this.state;

        if (checked) checkedIds.push(id);
        else checkedIds.splice(checkedIds.indexOf(id), 1);

        this.setState({ checkedIds: [...checkedIds] });
    };

    onCheckAll = ({ target: { checked } }) => {
        const { list } = this.state;

        const checkedIds = checked ? list.map(item => item.id) : [];

        this.setState({ checkedIds });
    };

    render() {
        const { loading, list, checkedIds } = this.state;

        if (!loading && !list.length) {
            return (
                <div className="emptyBox" style={{ height: "30vh" }}>
                    <Empty description="暂无权限数据，请到权限管理页新建" />
                </div>
            );
        }

        const indeterminate = !!checkedIds.length && checkedIds.length !== list.length;

        return (
            <>
                <p style={{ marginTop: 30 }}>
                    给角色分配权限，关联这个角色的用户会获得所有勾选的权限。
                </p>
                <MyTable length={list.length} loading={loading} className={styles.table1}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={!!checkedIds.length}
                                    indeterminate={indeterminate}
                                    onChange={this.onCheckAll}
                                />
                            </TableCell>
                            <TableCell>资源</TableCell>
                            <TableCell>操作</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell style={{ width: 200 }}>创建时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} selected={checkedIds.includes(item.id)} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={checkedIds.includes(item.id)}
                                        onChange={event => this.onCheck(event, item.id)}
                                    />
                                </TableCell>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.resource}</span>
                                </TableCell>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.operation || "-"}</span>
                                </TableCell>
                                <TableCell className={styles.description}>
                                    {item.description || "-"}
                                </TableCell>
                                <TableCell>
                                    {moment(item.createDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
                <div style={{ marginTop: 30 }}>
                    <Button variant="contained" color="primary" onClick={this.onSubmit}>
                        保 存
                    </Button>
                </div>
            </>
        );
    }
}

export default withRouter(Permission);
