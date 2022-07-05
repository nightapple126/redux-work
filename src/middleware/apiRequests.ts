import axios from "axios"
import * as Notifications from 'react-notification-system-redux';
import { Notification } from 'react-notification-system';
import {push} from "react-router-redux"

import * as api from "../../shared/apiEndpoints"
import * as actions from "../actions"
import { AppState, GridState, GridDataState } from "../models/state"
import { IDesignData } from "../models/state"

const limit: number = 6;

// TODO: add in helper file
let getErrorNotification = (error: string) => {
    return {
        title: "Something went wrong :(",
        message: error,
        position: "bc",
        autoDismiss: 60
    } as Notification
}

let getSuccessNotification = (message: string) => {
    return {
        title: "Success",
        message: message,
        position: "bc",
        autoDismiss: 5
    } as Notification
}

export function loadDesigns(approval: boolean) {
    let promise = (dispatch, getState) => {
        let appState: AppState = getState();
        let dataState = approval ? appState.grid.approval : appState.grid.catalog;
        axios.get(api.kApiReadDesigns, {
            params: {
                skip: dataState.skip, limit: limit, approval: approval
            }
        }).then(data => {
            approval ? dispatch(actions.designGridActions.populateApprovalGrid(data.data))
                : dispatch(actions.designGridActions.populateCatalogGrid(data.data))

        })
            .catch(err => {
                dispatch(Notifications.error(getErrorNotification(err.response.data.message)))
            })
    }
    return promise;
}

export function readDesign(designId: string) {
    let promise = (dispatch, getState) => {
        axios.get(api.kApiReadDesign, {
            params: {
                designId: designId
            }
        }).then(data => {
            dispatch(actions.designFormActions.loadApprove(data.data))
        })
            .catch(err => {
                dispatch(Notifications.error(getErrorNotification(err.response.data.message)))
            })
    }
    return promise;
}

export function upsertDesign(design: IDesignData) {
    let promise = (dispatch, getState) => {
        let req = design._id ? axios.put(api.kApiSubmitDesign, { design: design })
            : axios.post(api.kApiSubmitDesign, { ...design });

        req.then(result => {
            dispatch(Notifications.success(getSuccessNotification(result.data)))
            dispatch(push("/"))
        })
            .catch(err => {
                dispatch(Notifications.error(getErrorNotification(err.response.data.message)))
            })
    }
    return promise;
}
