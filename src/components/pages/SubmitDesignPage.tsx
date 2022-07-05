import * as React from 'react'
import { connect } from "react-redux"
import * as Axios from "axios"

import SubmitDesignForm from "../stateless/SubmitDesignForm"
import * as api from "../../middleware/apiRequests"
import * as state from "../../models/state"
import * as designActions from "../../actions/designFormActions"

class SubmitDesignPage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            approveMode: !!props.match.params.designId
        }
    }

    componentWillReceiveProps(props) {
        this.state = {
            approveMode: !!props.match.params.designId
        }
    }

    componentDidMount() {
        let designId = this.props.match.params.designId;
        if (designId) {
            console.log("we are modifying a design")
            // fire off an action to fill the state controlling the form
            this.props.dispatch(api.readDesign(designId));

        } else {
            console.log("we are making a new design")
        }
    }

    assignValuesToDesign(design : state.IDesignData, values) {
        let { url, title, description, approved, websiteImage } = values;
        design.url = url;
        design.description = description;
        design.title = title;
        design.pending = !approved;
        design.imageData = websiteImage;
    }

    submitDesign(values) {
        if (this.state.approveMode) {
            // if we are approving a design then send an update request
            let existingDesign: state.IDesignData = { ...this.props.design };
            this.assignValuesToDesign(existingDesign, values);
            this.props.dispatch(api.upsertDesign(existingDesign));
        } else {
            // if we are submiting a new design then send an add request
            let newDesign: state.IDesignData = { } as any;
            this.assignValuesToDesign(newDesign, values);
            this.props.dispatch(api.upsertDesign(newDesign));
        }

    }

    render() {
        return (
            <div>
                <SubmitDesignForm
                    onSubmit={this.submitDesign.bind(this)}
                    approveMode={this.state.approveMode} />
            </div>
        )
    }
}

function mapStateToProps(state: state.AppState, ownProps: any) {
    return { design: state.loadedDesign };
}

export default connect(mapStateToProps)(SubmitDesignPage);
