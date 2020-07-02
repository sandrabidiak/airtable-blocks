import {initializeBlock} from '@airtable/blocks/ui'
import React from 'react'

function HelloWorldBlock() {
    return <div>Hello world 🚀</div>
}

initializeBlock(() => <HelloWorldBlock />)
