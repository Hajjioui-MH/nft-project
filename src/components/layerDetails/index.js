import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Grid, Image, Header, Icon, Segment  } from 'semantic-ui-react'
import ImageCard from '../../controllers/ImageCard'
import { v4 as uuidv4 } from 'uuid';

import './index.css'
const cardStyle = {
	width: '230px',
	height: '280px',
	marginBottom: '7px'
}

function Index({ layers, setLayers, currentLayer, setCurrentLayer, setAvailableNfts, setCollectionSize }) {
	const [title, setTitle] = useState("")
	const [layerRarity, setLayerRarity] = useState("")
	const [listImages, setListImages] = useState([])

	useEffect(() => {
		const data = currentLayer.elements;
		setListImages(data)
	}, [currentLayer])

	const addImageToLayer = (event)=>{
		const file = event.files[0]
		console.log("onChange => addImageToLayer: ", file)
		if(file){
			const newElement = {
				id: uuidv4(), 
				name: file?.name ? file.name.split(".")[0] : "", 
				file_rarity: 100/(currentLayer.elements.length+1), 
				file_extension: file?.name ? file.name.split(".")[1] : "", 
				file
			}
			const updatedLayersList = layers.map(layer=>{
				return layer.id === currentLayer.id ? 
					{...layer, elements: [...layer.elements, newElement]}
				:
					layer;
			})
			setLayers(updatedLayersList)
			setCurrentLayer(updatedLayersList.find(layer=> layer.id===currentLayer.id))
			const totalNFTs = updatedLayersList.reduce( (acc, layer)=>{
				return acc * (layer.elements.length ? layer.elements.length : 1)
			}, 1)
			setAvailableNfts(totalNFTs)
			setCollectionSize(totalNFTs)
			//setListImages(list=>[...list, newElement])
		}
	}

	const addLayer = () =>{
		if (title) {
			const layer = {
				id: uuidv4(),
			    name: title,
			    elements: [],
			    layer_rarity: layerRarity ? layerRarity : 100
			}
			setLayers([...layers, layer])
		}
		setTitle("")
		setLayerRarity("")
	}

	const handleUpload = ()=>{
		const inputElement = document.getElementById('file-input')
		inputElement.click()
	}
	
	return (
		<div className="container-layer">
			<div className="flex-row">
				<div>
					<h2>Layers</h2>
					<p>Create and setup your layers and your art traits</p>
				</div>
				<Button onClick={()=>addLayer()} primary>Add New Layer</Button>
			</div>
			<div className="layer-content">
				<div className="left-side" >
				 {layers.map(layer=><div key={layer.id} className="layer"
				 		style={layer.name==currentLayer.name?{background: '#F3F3F3 0% 0% no-repeat padding-box'}:{}}
				 		onClick={()=>setCurrentLayer(layer)}
				 	>{layer.name}</div>)}
				</div>
				<div className="right-side" >
					<Form.Field>
				      <p className="label" >Layer Name</p>
				      <Input value={title} onChange={(e)=>setTitle(e.target.value)} className="input" />
				    </Form.Field>
				    <Form.Field>
				      <p className="label" >Rarity (%)</p>
				      <Input value={layerRarity} onChange={(e)=>setLayerRarity(e.target.value)} className="input" />
				    </Form.Field>
				    <Grid className="layer-images">
   						<Grid.Row columns={3}>
   						{listImages.map(element=> (
   							<Grid.Column key={element.id}>
						        <ImageCard handleUpload={handleUpload} name={element.name} rarity={element.file_rarity} source={URL.createObjectURL(element.file)} />
						    </Grid.Column>
   						) )}
						    <Grid.Column>
						      <Segment style={cardStyle} placeholder>
							    <Header icon>
							      <Icon name='pdf file outline' />
							      PNG, JPEG, and GIF
							    </Header>
							    <input hidden id="file-input" type="file" onChange={(e)=>addImageToLayer(e.target)} />
							    <Button onClick={()=>handleUpload()} primary>Upload</Button>
							  </Segment>
							</Grid.Column>
				    	</Grid.Row>
				    </Grid>
				</div>
			</div>

		</div>
	)
}

export default Index