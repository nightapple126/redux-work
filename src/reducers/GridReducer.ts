import { GridState, GridDataState } from "../models/state"
import { designGridActions } from "../actions"

let defaultDataState: GridDataState = { data: [], skip: 0, hasMore: true }
let defaultState: GridState = { catalog: defaultDataState, approval: defaultDataState }

const GridReducer = (state: GridState = defaultState, action: designGridActions.DesignGridAction): GridState => {
    switch (action.type) {
        case designGridActions.Type.PopulateApprovalGrid:
            {
                let newState = { ...state }
                newState.approval = GridDataReducer(state.approval, action);
                return newState;
            }
        case designGridActions.Type.PopulateCatalogGrid:
            {
                let newState = { ...state }
                newState.catalog = GridDataReducer(state.catalog, action);
                return newState;
            }
        case designGridActions.Type.ReportFetchError:
            return defaultState;
    }
    return state;
}

const GridDataReducer = (state: GridDataState = defaultDataState, action: designGridActions.DesignGridAction): GridDataState => {
    let data = action.data || [];
    switch (action.type) {
        case designGridActions.Type.PopulateApprovalGrid:
        case designGridActions.Type.PopulateCatalogGrid:
            {
                let newDataState: GridDataState =
                    {
                        data: state.data.concat(data),
                        skip: state.skip + data.length,
                        hasMore: data.length > 0
                    };
                return newDataState;

            }
    }
    return state;
}

export default GridReducer;

