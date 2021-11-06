import React from 'react'
import { Card, Icon, Image, Button } from 'semantic-ui-react'

function PreviewCard({name="", id="", source}) {

	const cardStyle = {
		width: '222px',
		height: '310px',
		marginBottom: '7px'
	}
	const buttonStyle = {
		marginTop: '4px'
	}

	return (
		<Card style={cardStyle}>
			<Image 
				src='https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg' 
				wrapped ui={false} />
		    <Card.Content>
		      <Card.Header>{name}</Card.Header>
		      <Card.Meta>{id}</Card.Meta>
		      <Button style={buttonStyle} content='View Metadata' basic />
		    </Card.Content>
		</Card>
	)
}

export default PreviewCard