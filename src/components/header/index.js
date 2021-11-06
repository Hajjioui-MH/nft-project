import React from 'react'
import { Icon } from 'semantic-ui-react'

import './index.css'

function Index() {
	return (
		<header>
			<div className="left-side">
				<span><Icon name='bars' size='large' /></span>
				<span>LOGO</span>
			</div>
			<div className="right-side" >
				<p>Logout</p>
			</div>
		</header>
	)
}

export default Index