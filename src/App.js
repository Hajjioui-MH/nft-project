import React, { useState, useEffect } from 'react'
import Menu from './components/header'
import ProjectDetails from './components/projectDetails'
import LayerDetails from './components/layerDetails'
import Generation from './components/generation'
import { networkChoice } from './constants'
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { getImagesURLs, isCanvasExist, loadImages } from './services'


import './App.css';

function App() {
  /* Project ===================================================== */
  const [projectName, setProjectName] = useState("")
  const [projectDetails, setProjectDetails] = useState("")
  const [extraMetadata, setExtraMetadata] = useState("")
  const [network, setNetwork] = useState(networkChoice.Ethereum)
  const [symbol, setSymbol] = useState("")
  const [sellerFee, setSellerFee] = useState("")
  const [externalURL, setExternalURL] = useState("")
  const [creatorAddress, setCreatorAddress] = useState("")
  /* Layer ======================================================== */
  const [layers, setLayers] = useState([
    {
      id: uuidv4(),
      name: "Background",
      elements: [],
      layer_rarity: 100
    }
  ])
  const [currentLayer, setCurrentLayer] = useState(layers[0])
  const [collectionSize, setCollectionSize] = useState(0)
  const [availableNfts, setAvailableNfts] = useState(0)
  let isStillOptions = true;
  let collection = [];
  let selectedCanvasList = [];
  let attributes = [];

  useEffect(() => {
    console.log("layers: ", layers)
  }, [layers])
  
  const drawLayer = (data,index)=>{
    console.log("drawLayer.......")
    var canvas = document.createElement("CANVAS");
    canvas.width = "230"
    canvas.height = "230"
    var context = canvas.getContext("2d");
    var sources = {};
    var {objURLs, objNames, objAttributes} = getImagesURLs(data);
    let iteration = 1;

    while (isCanvasExist(selectedCanvasList, objNames.join("/"))) {
      console.log(`--- ${iteration}`, objNames.join("/"))
      var {objURLs, objNames, objAttributes} = getImagesURLs(data);
      if(iteration > data.length*5){
        isStillOptions = false;
        break;
      }

      iteration++;
    }

    if(iteration <= data.length*5){
      console.log(`+++ ${iteration}`, objNames.join("/"))
      attributes.push(objAttributes)
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
            context.drawImage(images[`image${i+1}`], 0, 0, 230, 230)
          }
        })
        
        collection.push(canvas)
        console.log("collection: ", collection)
      });

    }else {
      console.log("Your Collection Can't be Generated.Please add more layers and images or decrease your collection size")
    }
  }

  const generateCollection = ()=>{
    let sizeCount = 1;
    while ( (sizeCount <= collectionSize) && isStillOptions ) {
      drawLayer(layers, sizeCount)
      sizeCount++;
    }
    //console.log(attributes)
    isStillOptions && collectionSize!==0 && setTimeout(()=> downloadCollection(layers, sizeCount),1000)
  }

  const downloadCollection = ()=>{
    let zip = new JSZip();
    let metadata = zip.folder("metadata");

    attributes.map((item, i)=>{
      const obj = {
        name: `#${i+1}`, 
        description: projectDetails, 
        external_url: externalURL,
        extra_metadata: extraMetadata ? JSON.stringify(JSON.parse(extraMetadata), null, 4) : "",
        network,
        symbol: symbol,
        seller_fee_basis_points: sellerFee,
        external_URL: externalURL,
        creatorAddress: creatorAddress,
        image: `${i+1}.png`,
        "attributes": item,
        "properties": {
          "category": "image",
          "files": [
            {
              "uri": `${i+1}.png`,
              "type": "image/png"
            }
          ],
          "creators": []
        },
        "compiler": "https://nft-generator.com"
      };
      
      metadata.file(`${i+1}.json`, JSON.stringify(obj, null, 4))
    })

    var img = zip.folder("assets");
    collection.map((item, i)=>{
      const base64Canvas = item.toDataURL("image/jpeg").split(';base64,')[1];
      img.file(`image_${i+1}.png`, base64Canvas, {base64: true});
    })

    zip.generateAsync({type:"blob"})
    .then(function(content) {
      console.log("Save......")
      FileSaver.saveAs(content, "collection.zip");
    });
  }


  return (
    <>
      <Menu />
      <div className="App">
        <ProjectDetails 
          name={projectName} setName={setProjectName}
          details={projectDetails} setDetails={setProjectDetails}
          extraMetadata={extraMetadata} setExtraMetadata={setExtraMetadata}
          network={network} setNetwork={setNetwork}
          symbol={symbol} setSymbol={setSymbol}
          sellerFee={sellerFee} setSellerFee={setSellerFee}
          externalURL={externalURL} setExternalURL={setExternalURL}
          creatorAddress={creatorAddress} setCreatorAddress={setCreatorAddress}
        />
        <LayerDetails 
          layers={layers} setLayers={setLayers} 
          currentLayer={currentLayer} setCurrentLayer={setCurrentLayer}
          setAvailableNfts={setAvailableNfts} setCollectionSize={setCollectionSize}
        />
        <Generation availableNfts={availableNfts} 
          projectName={projectName}
          details={projectDetails}
          extraMetadata={extraMetadata}
          network={network}
          symbol={symbol}
          sellerFee={sellerFee}
          externalURL={externalURL}
          creatorAddress={creatorAddress}
          generateCollection={generateCollection}
          collectionSize={collectionSize} setCollectionSize={setCollectionSize}
          layers={layers}
        />
      </div>
    </>
  );
}

export default App;
