import * as React from 'react'
import { connect } from "react-redux"

import * as api from "../../middleware/apiRequests"
import * as state from "../../models/state"

interface IDesignViewStateProps {
    design: state.IDesignData;
}

type IDesignViewProps = IDesignViewStateProps;


class DesignViewPage extends React.Component<any, any> {
    componentDidMount() {
        let designId = this.props.match.params.designId;
        // fire off request to load the design
        this.props.dispatch(api.readDesign(designId));
    }

    render() {
        let design = this.props.design as state.IDesignData;
        let imageData = "data:image/*;base64," + design.imageData;

        return (
            <div >
                <h4 style={{marginBottom:"10px"}}>{design.title}</h4>
                <a href={design.url}>{design.url}</a>
                <a href={design.url} style={{ cursor: 'pointer' }}>
                    <div className="ImageHolder" style={{position:"relative"}}>
                        <img src={imageData} />
                        <div className="LightOverlay" />
                    </div>
                </a>
                <br/>
                <p>{design.description}</p>
            </div>
        )

    }
}

function mapStateToProps(state: state.AppState, ownProps: any) {
    return { design: state.loadedDesign };
}

export default connect(mapStateToProps)(DesignViewPage);
