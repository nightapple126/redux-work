import * as Redux from "redux"

import {IDesignData} from "../models/state"

//export type DesignGridActionType = "A" | "B"
export const Type = {
    PopulateApprovalGrid: "PopulateApprovalGrid",
    PopulateCatalogGrid: "PopulateCatalogGrid",
    ReportFetchError: "ReportFetchError"
}

export interface DesignGridAction extends Redux.Action {
    type: any,
    data?: IDesignData[],
    error?: any
}

export const populateApprovalGrid = (data: IDesignData[]): DesignGridAction => {
    return {
        type: Type.PopulateApprovalGrid,
        data
    }
}

export const populateCatalogGrid = (data: IDesignData[]): DesignGridAction => {
    return {
        type: Type.PopulateCatalogGrid,
        data
    }
}

export const reportFetchError = (error: any): DesignGridAction => {
    return {
        type: Type.ReportFetchError,
        error
    }
}