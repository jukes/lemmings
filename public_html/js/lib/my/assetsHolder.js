define([],function() {
    
    var _MAX_IMAGES = 3;
    var _loadedImgs = 0;
    var _imgPath= './img/assets';
    var _sheets = {}; //Assoc array
    
    var _module = {};
    
    function _loadImg(name, filename){
        var someImage = new Image();
        _sheets[name] = someImage;
        someImage.src = filename;
        someImage.onload = _handleImageLoad;
        someImage.onerror = _handleImageError;        
    }
    
    function _handleImageLoad(e){
        _loadedImgs++;
        if(_loadedImgs === _MAX_IMAGES){
            //
            if(_module.onImagesLoaded){
                _module.onImagesLoaded(_sheets);
            }
        }
    }
    
    function _handleImageError(e){
        if(_module.onImagesError){
            _module.onImagesError(e.target);
        }
    }
    
    /**
     * Load all images
     * @returns {undefined}
     */
    function _loadAll(){
        _loadImg('lemmingWalk', _imgPath+'/MonsterARun.png');        
        //_loadImg('lemmingWalk', _imgPath+'/oorjG.png');        
        _loadImg('lemmingFall', _imgPath+'/MonsterAIdle.png');
        _loadImg('shovel', _imgPath+'/shovel.png');
        _loadImg('level', _imgPath+'/alevel.png');
    }
    
    //Exposed methos and properties  
    _module.load = function(){_loadAll();};
    _module.sheet = function(name){
        return _sheets[name];
    };
    _module.imagesLoaded = function(){
        return _loadedImgs;
    };  
    _module.onImagesError = function(imageObj){};
    _module.onImagesLoaded = function(imgList){};
    
    return _module;

});