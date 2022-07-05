import GridReducer from "./GridReducer"
import DesignFormReducer from "./DesignFormReducer"
import { reducer as formReducer } from 'redux-form'
import {reducer as notifications} from 'react-notification-system-redux';

const reducers = {
    grid: GridReducer,
    // this is used to initialise the form state
    loadedDesign: DesignFormReducer,
    // this is internally used by redux-form
    form: formReducer,
    // notification library reducer
    notifications
}

export default reducers;