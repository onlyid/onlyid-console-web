import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import styles from "./index.module.css"
import { Button } from "@material-ui/core"
import SelectBar from "./SelectBar"
import { ArrowBack } from "@material-ui/icons"
import http from "my/http"
import UserTable from "./UserTable"

class Blacklist extends PureComponent {
    state = {
        loading: true
    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        const { dispatch, user } = this.props
        const { bl_current, bl_pageSize, bl_keyword } = user

        this.setState({ loading: true })
        const params = { current: bl_current, pageSize: bl_pageSize, keyword: bl_keyword }
        const { list, total } = await http.get("users/blacklist", { params })

        if (list.length || bl_current === 1) {
            dispatch({ type: "user", bl_list: list, bl_total: total })
            this.setState({ loading: false })
        } else {
            await dispatch({ type: "user", bl_current: bl_current - 1 })
            this.initData()
        }
    }

    goBack = () => {
        const { history } = this.props
        history.goBack()
    }

    onChange = ({ target }) => {
        const { dispatch } = this.props
        dispatch({ type: "user", [target.name]: target.value })
    }

    onSearch = async () => {
        const { dispatch } = this.props
        await dispatch({ type: "user", bl_current: 1 })
        this.initData()
    }

    onPaginationChange = async ({ pageSize, current }) => {
        const { dispatch } = this.props

        await dispatch({ type: "user", bl_pageSize: pageSize, bl_current: current })
        this.initData()
    }

    render() {
        const { loading } = this.state
        const { user } = this.props
        const { bl_list, bl_current, bl_pageSize, bl_total, bl_keyword } = user

        return (
            <>
                <Button
                    onClick={this.goBack}
                    startIcon={<ArrowBack />}
                    size="small"
                    className={styles.backButton}
                >
                    返回用户列表
                </Button>
                <h1>黑名单</h1>
                <p>加入黑名单的用户不能登录你名下的所有应用</p>
                <SelectBar keyword={bl_keyword} onChange={this.onChange} onSearch={this.onSearch} />
                <UserTable
                    list={bl_list}
                    loading={loading}
                    current={bl_current}
                    pageSize={bl_pageSize}
                    total={bl_total}
                    onPaginationChange={this.onPaginationChange}
                />
            </>
        )
    }
}

export default connect(({ user }) => ({ user }))(withRouter(Blacklist))
