import React, { PureComponent } from "react";
import styles from "./ClientTable.module.css";
import MyTable from "components/MyTable";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import http from "my/http";
import { withRouter } from "react-router-dom";

class ClientTable extends PureComponent {
    state = {
        list: [],
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const params = { userId: match.params.id };
        const list = await http.get("clients/by-user", { params });
        this.setState({ list, loading: false });
    };

    render() {
        const { list, loading } = this.state;

        return (
            <>
                <p style={{ marginTop: 30 }}>
                    用户授权的应用列表，这些应用可以访问该用户的账号数据。
                </p>
                <MyTable length={list.length} loading={loading} className={styles.clientTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell>应用</TableCell>
                            <TableCell>首次登录时间</TableCell>
                            <TableCell>最近登录时间</TableCell>
                            <TableCell>最近登录IP</TableCell>
                            <TableCell>最近登录地点</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className={styles.clientBox}>
                                        <img src={item.iconUrl} alt="icon" />
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {moment(item.linkDate).format(DATE_TIME_FORMAT)}
                                </TableCell>
                                <TableCell>
                                    {item.lastDate
                                        ? moment(item.lastDate).format(DATE_TIME_FORMAT)
                                        : "-"}
                                </TableCell>
                                <TableCell>{item.lastIp || "-"}</TableCell>
                                <TableCell>{item.lastLocation || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MyTable>
            </>
        );
    }
}

export default withRouter(ClientTable);
