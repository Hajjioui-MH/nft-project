import React, {useState} from 'react'
import { Card, Icon, Image, Input } from 'semantic-ui-react'

function ImageCard({id, name="", rarity="", source="", layers, currentLayer, setLayers, setCurrentLayer}) {

	const [isInput, setIsInput] = useState(false)
	const [isInputRarity, setIsInputRarity] = useState(false)
	const [fileName, setFileName] = useState(name)
	const [fileRarity, setFileRarity] = useState()
	const cardStyle = {
		width: '222px',
		height: '280px',
		marginBottom: '7px'
	}

	const updateImageLayer = (event)=>{
		console.log("id: ", id)
		const file = event.target.files[0]
		if(file){
			const newElement = {
				id: id, 
				name: file?.name ? file.name.split(".")[0] : "", 
				file_rarity: 100/(currentLayer.elements.length+1), 
				file_extension: file?.name ? file.name.split(".")[1] : "", 
				file
			}
			const newElementsList = currentLayer.elements.map(element=>{
				return element.id===id ? newElement : element
			})
			const updatedLayersList = layers.map(layer=>{
				return layer.id === currentLayer.id ? 
					{...layer, elements: newElementsList}
				:
					layer;
			})
			setLayers(updatedLayersList)
			setCurrentLayer(updatedLayersList.find(layer=> layer.id===currentLayer.id))
		}
	}
	const handleFileUpdate = ()=>{
		const inputElement = document.getElementById('file-input-update')
		inputElement.click()
	}
	const updateFileName = ()=>{
		if(fileName){
			const newElementsList = currentLayer.elements.map(element=>{
				return element.id===id ? {...element, name: fileName} : element
			})
			const updatedLayersList = layers.map(layer=>{
				return layer.id === currentLayer.id ? 
					{...layer, elements: newElementsList}
				:
					layer;
			})
			setLayers(updatedLayersList)
			setCurrentLayer(updatedLayersList.find(layer=> layer.id===currentLayer.id))
		}
		setIsInput(false)
	}
	const updateFileRarity = ()=>{
		const rarity = ( (100-Number(fileRarity)) / (currentLayer.elements.length-1) ).toFixed(2).replace(/\.00/g, '')
		if(fileRarity){
			const newElementsList = currentLayer.elements.map(element=>{
				return element.id===id ? 
					{...element, file_rarity: fileRarity} 
				: 
					{...element, file_rarity: rarity}
			})
			const updatedLayersList = layers.map(layer=>{
				return layer.id === currentLayer.id ? 
					{...layer, elements: newElementsList}
				:
					layer;
			})
			setLayers(updatedLayersList)
			setCurrentLayer(updatedLayersList.find(layer=> layer.id===currentLayer.id))
		}
		setIsInputRarity(false)
	}

	return (
		<>
		<Card style={cardStyle}>
			<Icon onClick={()=>handleFileUpdate()} id="upload-icon" name='upload'  />
			<Image
				src={source} 
				wrapped ui={false} />
		    <Card.Content>
			{isInput ? 
			  <div style={{width: '120px'}} className="ui action input">
				<input value={fileName} type="text" onChange={(e)=>setFileName(e.target.value)} />
				<button onClick={()=>updateFileName()} className="ui tiny button">Update</button>
			  </div>
			  : 
			  <Card.Header style={{cursor: 'pointer'}} onClick={()=>!isInputRarity && setIsInput(true)} >{name}</Card.Header>
			}
		    {isInputRarity ?
		      <div style={{width: '120px'}} className="ui mini action input">
				<input type="text" onChange={(e)=>setFileRarity(e.target.value)} />
				<button onClick={()=>updateFileRarity()} className="ui tiny button">Update</button>
			  </div>
			  :
		      <Card.Meta onClick={()=>!isInput && setIsInputRarity(true)} style={{marginTop: '1px'}}>{`Rarity : ${rarity}%`}</Card.Meta>
		    }
		    </Card.Content>
		</Card>
		<input hidden id="file-input-update" type="file" onChange={(e)=>updateImageLayer(e)} />
		</>
	)
}

export default ImageCard