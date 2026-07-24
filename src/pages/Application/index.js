import styles from "./index.module.css"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import Client from "./Client"
import Home from "./Home"

function Index() {
    const match = useRouteMatch()

    return (
        <div className={styles.root}>
            <Switch>
                <Route path={`${match.path}/:id`}>
                    <Client />
                </Route>
                <Route path={match.path}>
                    <Home />
                </Route>
            </Switch>
        </div>
    )
}

export default Index
