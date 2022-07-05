import * as React from 'react'
import { Field, reduxForm, formValueSelector, FormProps } from 'redux-form'
import { connect } from "react-redux"

import * as state from "../../models/state"
import { designFormActions } from "../../actions"

// TODO: put in own file
class ImageHolder extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            imageData: ""
        }
    }
    componentWillReceiveProps(props) {
        this.setState({ imageData: props.input.value })
    }

    onFileChange() {
        var file = (this.refs.file as any).files[0];
        var reader = new FileReader();

        reader.onloadend = (e) => {
            let imageData = reader.result.substring(reader.result.indexOf(",") + 1);
            this.props.onImageChange && this.props.onImageChange(imageData);

            this.setState({ imageData: imageData });
        }
        reader.readAsDataURL(file);
    }
    render() {
        let imageData = "data:image/*;base64," + this.state.imageData;
        return (
            <div className="ImageHolder">
                <img src={imageData} />
                <input ref="file" type="file" multiple={false} onChange={this.onFileChange.bind(this)} />
                <div>*If you don't give an image, one will be generated on the server.</div>
            </div>
        )
    }
}

interface IDesignFormStateProps {
    initialValues: {};
}

interface IDesignFormOwnProps {
    onSubmit(values: any): void;
    approveMode: boolean;
}

interface IDesignFormDispatchProps {
    unloadDesign(): void;
}

type IDesignFormProps = FormProps<any, any, any> & IDesignFormStateProps & IDesignFormDispatchProps & IDesignFormOwnProps;

class SubmitDesignForm extends React.Component<IDesignFormProps, any> {

    render() {
        const { handleSubmit, approveMode } = this.props;
        return (
            <div>
                <form onSubmit={handleSubmit} className="container">
                    <div className="row">
                        <div className="six columns">
                            <label htmlFor="url">Website Url</label>
                            <Field component="input" className="u-full-width" type="text" placeholder="www.teamliquid.net/" name="url" />
                        </div>
                        <div className="six columns">
                            <label htmlFor="title">Title</label>
                            <Field component="input" className="u-full-width" type="text" placeholder="Beautiful Design" name="title" />
                        </div>
                    </div>

                    <label htmlFor="websiteImage">Image</label>
                    <Field component={ImageHolder} className="u-full-width" name="websiteImage" />

                    <label htmlFor="description">Short Description</label>
                    <Field component="textarea" className="u-full-width" placeholder="A modern, clean b2b website..." name="description" />
                    {approveMode && <div>
                        <label htmlFor="approved">
                            <Field name="approved" id="approved" component="input" type="checkbox" />
                            Approved
                        </label>
                    </div>}
                    <button className="button-primary" type="submit"> Submit</button>
                </form>
            </div>
        )
    }
}

let ConnectedSubmitDesignForm = reduxForm({
    form: "submitDesign",
    enableReinitialize: true
})(SubmitDesignForm);

// The values should be in the form { field1: 'value1', field2: 'value2' } i.e a Field in the form with <name> should have a key in the dictionary with <name>
function mapStateToProps(state: state.AppState, ownProps): IDesignFormStateProps {
    if(!ownProps.approveMode)
        return { initialValues: {}};
        
    let values = {
        url: state.loadedDesign.url,
        description: state.loadedDesign.description,
        title: state.loadedDesign.title,
        approved: state.loadedDesign.pending && !state.loadedDesign.pending,
        websiteImage: state.loadedDesign.imageData
    }

    return { initialValues: values };
}

export default connect<IDesignFormStateProps, IDesignFormDispatchProps, IDesignFormOwnProps>(
    mapStateToProps
)(ConnectedSubmitDesignForm)
