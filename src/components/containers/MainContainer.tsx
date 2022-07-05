import * as React from 'react'
import { push } from "react-router-redux"
import { connect } from "react-redux"
import { NavLink, Link, Route } from "react-router-dom"
import InfiniteScoller from "redux-infinite-scroll"
import * as Notifications from 'react-notification-system-redux';

import SubmitDesignPage from "../pages/SubmitDesignPage"
import DesignViewPage from "../pages/DesignViewPage"
import ApprovalPage from "../pages/ApprovalPage"
import UserSettingsPage from "../pages/UserSettingsPage"
import CatalogPage from "../pages/CatalogPage"
import { AppState } from "../../models/state"

class MainContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { notifications, match } = this.props;
        return (
            <div>
                {/*Top toolbar*/}
                <nav className="TopNav">
                    <h5 className="Heading"><Link to="/">Beautiful Designs</Link></h5>
                    <ul>
                        <li><NavLink exact to="/" activeClassName="ActiveLink">Catalog</NavLink></li>
                        <li><NavLink exact to="/submit" activeClassName="ActiveLink">Submit</NavLink></li>
                        <li><NavLink exact to="/approval" activeClassName="ActiveLink">Approve</NavLink></li>
                    </ul>
                </nav>
                <div className="container" style={{marginTop: "20px"}}>
                    <div className="u-full-width">
                        <Route exact path={match.url} component={CatalogPage} />
                        <Route exact path={match.url + "design/:designId"} component={DesignViewPage} />
                        <Route exact path={match.url + "submit/:designId?"} component={SubmitDesignPage} />
                        <Route exact path={match.url + "approval"} component={ApprovalPage} />
                        <Route exact path={match.url + "settings"} component={UserSettingsPage} />
                    </div>
                </div>
                <Notifications notifications={notifications} />
            </div>
        )
    }
}

export default connect<any, any, any>(state => ({ notifications: state.notifications }))(MainContainer);