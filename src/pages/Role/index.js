import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { Route, Switch, withRouter } from "react-router-dom";
import Role from "./Role";
import Home from "./Home";

class Index extends PureComponent {
    render() {
        const { match } = this.props;

        return (
            <div className={styles.root}>
                <Switch>
                    <Route path={`${match.path}/:clientId/:id`}>
                        <Role />
                    </Route>
                    <Route path={`${match.path}/:clientId?`}>
                        <Home />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default withRouter(Index);
