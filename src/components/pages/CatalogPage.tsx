import * as React from 'react'

import DesignGridContainer from "../containers/DesignGridContainer"

class CatalogPage extends React.Component<any, any> {

    render() {
        return <div>
            <DesignGridContainer approval={false}/>
        </div>
    }
}

export default CatalogPage;