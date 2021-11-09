import React, { useState, useEffect } from 'react'
import Menu from './components/header'
import ProjectDetails from './components/projectDetails'
import LayerDetails from './components/layerDetails'
import Generation from './components/generation'
import { networkChoice, pixelFormat, format } from './constants'
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { getImagesURLs, isCanvasExist, loadImages } from './services'

import './App.css';

function App() {
  /* Project ===================================================== */
  const [projectName, setProjectName] = useState("")
  const [projectDetails, setProjectDetails] = useState("")
  const [extraMetadata, setExtraMetadata] = useState(null)
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
  const [isLoading, setIsLoading] = useState(false)
  const [isPixelated, setIsPixelated] = useState(false)
  let isStillOptions = true;
  let collection = [];
  let selectedCanvasList = [];
  let attributes = [];
  let size = pixelFormat.ratio;
  let w = format.width * size;
  let h = format.height * size;

  useEffect(() => {
    console.log("layers: ", layers)
  }, [layers])
  
  const drawLayer = (data,index)=>{
    console.log("drawLayer.......")
    var canvas = document.createElement("CANVAS");
    var context = canvas.getContext("2d");
    canvas.width = format.width;
    canvas.height = format.height;
    
    context.imageSmoothingEnabled = false;

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
            !isPixelated && context.drawImage(images[`image${i+1}`], 0, 0, canvas.width, canvas.height)
            isPixelated && context.drawImage(images[`image${i+1}`], 0, 0, w, h)
          }
        })
        
        isPixelated && context.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        collection.push(canvas)
        console.log("collection: ", collection)
      });

    }else {
      console.log("Your Collection Can't be Generated.Please add more layers and images or decrease your collection size")
    }
  }

  const generateCollection = ()=>{
    setIsLoading(true)
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
        name: `${projectName} #${i+1}`, 
        description: projectDetails, 
        network,
        image: `${i+1}.png`,
        attributes: item,
        compiler: "https://nft-generator.com"
      };
      if (network==networkChoice.Solana){
        Object.assign(obj, {
          symbol: symbol,
          seller_fee_basis_points: sellerFee,
          external_URL: externalURL,
          creatorAddress: creatorAddress,
        })
      }
      console.log()
      if(typeof JSON.parse(extraMetadata) == 'object'){
        const jsonMetaData = JSON.parse(extraMetadata);
        metadata.file(`${i+1}.json`, JSON.stringify(Object.assign(obj, jsonMetaData), null, 4))
      }else {
        metadata.file(`${i+1}.json`, JSON.stringify(obj, null, 4))
      }
    })

    var img = zip.folder("assets");
    collection.map((item, i)=>{
      const base64Canvas = item.toDataURL("image/jpeg").split(';base64,')[1];
      img.file(`image_${i+1}.png`, base64Canvas, {base64: true});
    })

    zip.generateAsync({type:"blob"})
    .then(function(content) {
      setIsLoading(false)
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
          isLoading={isLoading} setIsLoading={setIsLoading}
          isPixelated={isPixelated} setIsPixelated={setIsPixelated}
        />
      </div>
    </>
  );
}

export default App;
