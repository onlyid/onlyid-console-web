import React, { PureComponent } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import styles from "./index.module.css";
import User from "./User";
import Home from "./Home";

class Index extends PureComponent {
    render() {
        const { match } = this.props;

        return (
            <div className={styles.root}>
                <Switch>
                    <Route path={`${match.path}/:id`}>
                        <User />
                    </Route>
                    <Route path={match.path}>
                        <Home />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default withRouter(Index);
