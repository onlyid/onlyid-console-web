import { Route, Switch, useRouteMatch } from "react-router-dom"
import styles from "./index.module.css"
import User from "./User"
import Blacklist from "./Blacklist"
import Home from "./Home"

export default function Index() {
    const match = useRouteMatch()

    return (
        <div className={styles.root}>
            <Switch>
                <Route path={`${match.path}/blacklist`}>
                    <Blacklist />
                </Route>
                <Route path={`${match.path}/:id`}>
                    <User />
                </Route>
                <Route path={match.path}>
                    <Home />
                </Route>
            </Switch>
        </div>
    )
}
