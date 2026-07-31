import styles from "./index.module.css"
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom"
import mainTabs from "components/MainTabs.module.css"
import { Tab, Tabs } from "@material-ui/core"
import Info from "./Info"
import Renewal from "./Renewal"
import Notification from "./Notification"

export default function Tenant() {
    const history = useHistory()
    const match = useRouteMatch()
    const location = useLocation()

    const onTabChange = (event, value) => {
        history.push(`${match.url}/${value}`)
    }

    const currentTab = location.pathname.split("/")[2]

    return (
        <div className={styles.root}>
            <h1>租户设置</h1>
            <Tabs
                value={currentTab || "info"}
                onChange={onTabChange}
                indicatorColor="primary"
                className={mainTabs.root}
                style={{ marginTop: 40 }}
            >
                <Tab label="租户信息" value="info" />
                <Tab label="订阅续费" value="renewal" />
                <Tab label="通知设置" value="notification" />
            </Tabs>
            <Switch>
                <Route path={`${match.path}/info`}>
                    <Info />
                </Route>
                <Route path={`${match.path}/renewal`}>
                    <Renewal />
                </Route>
                <Route path={`${match.path}/notification`}>
                    <Notification />
                </Route>
                <Route path={match.path}>
                    <Redirect to={`${match.url}/info`} />
                </Route>
            </Switch>
        </div>
    )
}
