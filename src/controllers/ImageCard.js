import React, {useState} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

function ImageCard({name="", rarity="", source="", handleUpload}) {

	const [isInput, setIsInput] = useState(false)
	const cardStyle = {
		width: '222px',
		height: '280px',
		marginBottom: '7px'
	}

	return (
		<>
		<Card style={cardStyle}>
			<Icon onClick={()=>handleUpload()} id="upload-icon" name='upload'  />
			<Image
				src={source} 
				wrapped ui={false} />
		    <Card.Content>
		   	  <Card.Header>{name}</Card.Header>
		      <Card.Meta>{`Rarity : ${rarity}%`}</Card.Meta>
		    </Card.Content>
		</Card>
		</>
	)
}

export default ImageCard