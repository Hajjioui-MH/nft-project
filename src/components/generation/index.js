import React, { useState, useEffect } from 'react'
import { Grid, Input, Button, Card, Image as SemImage } from 'semantic-ui-react'
import PreviewCard from '../../controllers/PreviewCard'
import { getImagesURLs, isCanvasExist, loadImages } from '../../services'
import { v4 as uuidv4 } from 'uuid';

import './index.css'
const cardStyle = {
		width: '230px',
		height: '320px',
		marginBottom: '7px'
	}
	const buttonStyle = {
		marginTop: '4px'
	}

function Index({ projectName, availableNfts=0, collectionSize, setCollectionSize, generateCollection, layers }) {

	const [previewList, setPreviewList] = useState([])//[ {id, name, url, meta_data} ]
	let selectedCanvasList = [];

	useEffect(() => {
		if(layers[0]?.elements.length >= 1 ){
			setPreviewList([])
			console.log(" ***** Layers Changed ***** ")
			for(let i=1; i<=4; i++){
				var canvas = document.createElement("CANVAS");
		    canvas.width = "200"
		    canvas.height = "200"
		  	var context = canvas.getContext('2d');

		  	var sources = {};
		    var {objURLs, objNames, objAttributes} = getImagesURLs(layers);
		    let iteration = 1;
		    while (isCanvasExist(selectedCanvasList, objNames.join("/"))) {
		      console.log(`--- ${iteration}`, objNames.join("/"))
		      var {objURLs, objNames, objAttributes} = getImagesURLs(layers);
		      if(iteration > layers.length*5){
		        break;
		      }
		      iteration++;
		    }

		  	if(iteration <= layers.length*5){
		      console.log(`+++ ${iteration}`, objNames.join("/"))
		      selectedCanvasList.push(objNames.join("/"))
		      console.log(selectedCanvasList)

		      objURLs.forEach((url,i)=>{
		        const key = `image${i+1}`;
		        Object.assign(sources, {[key]: url})
		      })

		      loadImages(sources, function(images) {
		      console.log("loadImages......")
		        objURLs.forEach((url,i)=>{
		          if (Boolean(url)) {
		            context.drawImage(images[`image${i+1}`], 0, 0, 200, 200)
		          }
		        })
		        
		        var dataURL = canvas.toDataURL();
		    		setPreviewList( (previousItem)=> [...previousItem, {id: uuidv4(), name:`${projectName} #${i}`, url:dataURL, attributes: objAttributes}])
		      });
				}
    	}
  	}
	}, [layers])

	function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }

  const openMetaData = (data)=>{
		var myWindow = window.open('','_blank');
		var doc = myWindow.document;
		doc.open();
		doc.write(JSON.stringify(data, null, 4));
		doc.close();
  	console.log("data: ", data)
  }


	return (
		<div className="container-generation" >
			<h2>Generation</h2>
			<p>{`${availableNfts} Available NFTs`}</p>
			<Grid className="preview">
				<h3>Preview</h3>
				<Grid.Row columns={4}>
					{previewList.map((exemple, index)=>{
						return(
							<Grid.Column>
				    	<Card style={cardStyle}>
								<img
									id="myImage" 
									src={exemple.url} 
								/>
							    <Card.Content>
							      <Card.Header>{exemple.name}</Card.Header>
							      <Card.Meta>{exemple.id}</Card.Meta>
							      <Button onClick={()=>openMetaData(exemple.attributes)} style={buttonStyle} content='View Metadata' basic />
							    </Card.Content>
							</Card>
				    </Grid.Column>
						)
					})

					}
				    
		    </Grid.Row>
		    </Grid>
		    <Grid className="isready">
				<h3>Is Everything Ready?</h3>
				<Grid.Row columns={2} verticalAlign='bottom' >
					<Grid.Column>
						<p>Collection Size</p>
				        <Input onChange={(e)=>setCollectionSize(e.target.value)} width={10} className="input" />
				    </Grid.Column>
			    	<Grid.Column>
				        <Button onClick={()=>generateCollection()} color={'green'}>{`Generate ${collectionSize} NFTS`}</Button>
				    </Grid.Column>
		    	</Grid.Row>
		    </Grid>
		</div>
	)
}

export default Index