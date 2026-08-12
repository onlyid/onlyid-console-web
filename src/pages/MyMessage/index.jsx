import { Route, Switch, useRouteMatch } from "react-router-dom"
import styles from "./index.module.css"
import Message from "./Message"
import Home from "./Home"

export default function Index() {
    const match = useRouteMatch()

    return (
        <div className={styles.root}>
            <Switch>
                <Route path={`${match.path}/:id`}>
                    <Message />
                </Route>
                <Route path={match.path}>
                    <Home />
                </Route>
            </Switch>
        </div>
    )
}
