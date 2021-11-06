export const getImagesURLs = (data)=>{
    const obj = data.map((_layer,i)=>{
      let url = null;
      let name = null;
      let attribut = null;
      const rand = Math.random();
      const number = _layer.elements.length
      let element =
      _layer.elements[Math.floor(rand * number)] ? _layer.elements[Math.floor(rand * number)] : null;
    
      if (element) {
        url = URL.createObjectURL(element.file)
        name = element.name
        attribut = {trait_type: _layer.name, value: element.name};
      }
      return { url, name, attribut};
    })
    return {objURLs: obj.map(e=>e.url), objNames: obj.map(e=>e.name), objAttributes: obj.map(e=>e.attribut)};
}


export const isCanvasExist = (Canvaslist, newCanvas)=>{
    const foundCnv = Canvaslist.find(e=> e === newCanvas );
    return foundCnv == undefined ? false : true;
}

export const loadImages = (sources, callback)=> {
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