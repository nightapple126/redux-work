import { IDesignData } from "../models/state"
import { designFormActions } from "../actions"


const DesignFormReducer = (state: IDesignData, action: designFormActions.DesignFormAction): IDesignData => {
    state = state || {};
    switch (action.type) {
        case designFormActions.Type.LoadApprove:
            {
                return action.design || state;
            }

    }
    return state;
}


export default DesignFormReducer;

