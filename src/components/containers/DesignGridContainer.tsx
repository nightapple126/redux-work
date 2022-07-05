import * as React from 'react'
import { push } from "react-router-redux"
import { connect } from "react-redux"
import InfiniteScoller from "redux-infinite-scroll"

import * as apiRequests from "../../middleware/apiRequests"
import { AppState, GridState, GridDataState, IDesignData } from "../../models/state"


import DesignThumbnail from "../stateless/DesignThumbnail"

interface IDesignGridStateProps {
    gridState: GridDataState
}

interface IDesignGridDispatchProps {
    readDesigns: () => void;
    onClickHandler:(designId: string) => void;
}

interface IDesignGridOwnProps {
    approval: boolean;
}

type IDesignGridProps = IDesignGridStateProps & IDesignGridDispatchProps & IDesignGridOwnProps;

function mapStateToProps(state: AppState, ownProps: IDesignGridOwnProps) {
    let newProps = { gridState: ownProps.approval ? state.grid.approval : state.grid.catalog }
    return newProps;
}

function mapDispatchToProps(dispatch, ownProps: IDesignGridOwnProps) {
    let readDesigns = (): void => dispatch(apiRequests.loadDesigns(ownProps.approval));

    let onClickHandler = (designId: string) : void => {
        let callbackUrlBase = ownProps.approval ? "submit" : "design";
        dispatch(push(callbackUrlBase + "/" + designId));
    }

    let newProps = { readDesigns, onClickHandler }
    return newProps;
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    let newProps = { ...stateProps, ...dispatchProps, ...ownProps };
    return newProps;
}

class DesignGridContainer extends React.Component<IDesignGridProps, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    loadMore() {
        console.log('loading More');
        this.props.readDesigns();
    }

    createData() {
        let gridData = this.props.gridState.data;
        return gridData.map(function (design, key) {
            return <DesignThumbnail key={key} design={design} onClick={(designId) => this.props.onClickHandler(designId)} />
        }, this)
    }

    render() {
        let x = <InfiniteScoller
            className="DesignGrid"
            elementIsScrollable={false}
            loadMore={this.loadMore.bind(this)}
            hasMore={this.props.gridState.hasMore}
            showLoader={false}
            threshold={400}
            items={this.createData()} />
        return x;
    }
}

export default connect<IDesignGridStateProps, IDesignGridDispatchProps, IDesignGridOwnProps, IDesignGridProps>
    (mapStateToProps, mapDispatchToProps, mergeProps)(DesignGridContainer);