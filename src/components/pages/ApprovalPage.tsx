import * as React from 'react'

import DesignGridContainer from "../containers/DesignGridContainer"

class ApprovalPage extends React.Component<any, any> {

    render() {
        return <div>
            <DesignGridContainer approval={true}/>
        </div>
    }
}

export default ApprovalPage;