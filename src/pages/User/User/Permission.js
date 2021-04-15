import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import http from "my/http";
import styles from "./Permission.module.css";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import MyTable from "components/MyTable";
import tipBox from "../../../components/TipBox.module.css";

class Permission extends PureComponent {
    state = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0,
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });

        const { match } = this.props;
        const { current, pageSize } = this.state;

        const params = { current, pageSize, userId: match.params.id };
        const { list, total } = await http.get("permissions/by-user", { params });
        this.setState({ list, total, loading: false });
    };

    onPaginationChange = ({ pageSize, current }) => {
        this.setState({ pageSize, current }, this.initData);
    };

    render() {
        const { list, current, pageSize, total, loading } = this.state;

        const pagination = { current, pageSize, total };

        return (
            <>
                <p style={{ marginTop: 30 }}>这些是该用户拥有的所有权限（合并所有角色）。</p>
                <MyTable
                    length={list.length}
                    loading={loading}
                    className={styles.table1}
                    pagination={pagination}
                    onPaginationChange={this.onPaginationChange}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>资源</TableCell>
                            <TableCell>操作</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>所属应用</TableCell>
                            <TableCell>来自角色</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.resource}</span>
                                </TableCell>
                                <TableCell className={styles.grayBox}>
                                    <span>{item.operation || "-"}</span>
                                </TableCell>
                                <TableCell className={styles.description}>
                                    {item.description || "-"}
                                </TableCell>
                                <TableCell className={styles.clientName}>
                                    {item.clientName}
                                </TableCell>
                                <TableCell>{item.roles.split(",").join("，")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            唯ID不支持直接给用户分配权限，请先给用户分配角色，再给角色分配权限，即可让用户拥有所需权限。
                        </li>
                    </ol>
                </div>
            </>
        );
    }
}

export default withRouter(Permission);
