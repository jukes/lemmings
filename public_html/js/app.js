requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    shim: {
        easeljs: {
            exports: 'createjs'
        },
        ndgmr: {
            exports: 'ndgmr'
        }
    },
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

requirejs(['my/assetsHolder', 'easeljs', 'my/lemmings', 'ndgmr'],
        function(assetsHolder, createjs, lemmings, ndgmr) {

            var canvas;
            var stage;
            var screen_width;
            var screen_height;
            var lemming_list = [];
            var levelBitmap;
            var levelObj;
            var MAX_LEMMINGS = 5;

            canvas = document.getElementById('gameCanvas');

            assetsHolder.onImagesLoaded = function(imgList) {
                for (var prop in imgList) {
                    console.log('Loaded: ' + imgList[prop].src);
                }
                startGame();
            };
            assetsHolder.onImagesError = function(imageObj) {
                console.log('Error loading [' + imageObj.src + ']');
            };
            
            //Load level json obj
            var ajaxCall = new XMLHttpRequest();
            ajaxCall.open('GET', 'js/json/alevel.json', false);
            ajaxCall.onreadystatechange = function() {
                if (ajaxCall.readyState === 4) {                    
                    levelObj = JSON.parse(ajaxCall.responseText);
                    console.log('json level loaded');
                }
            };
            ajaxCall.send();

            //Load the sprites!!!
            assetsHolder.load();

            function reset() {
                stage.removeAllChildren();
                createjs.Ticker.removeAllListeners();
                stage.update();
            }

            /**
             * Start DA Game!!!
             * @returns {undefined}
             */
            function startGame() {

                //Create a new stage.
                stage = new createjs.Stage(canvas);

                //Save canvas dimensions for later calcs
                screen_width = canvas.width;
                screen_height = canvas.height;

                //Load level 
                levelBitmap = new createjs.Bitmap(assetsHolder.sheet('level'));
                levelBitmap.x = 0;
                levelBitmap.y = 190;
                stage.addChild(levelBitmap);
                //stage.prototype.level = levelBitmap;

                //Initialize lemming sprites
                lemmings.init();

                var lemming = createLemming();
                stage.addChild(lemming.fallAnimation);

                createjs.Ticker.addListener(window);
                createjs.Ticker.useRAF = true;
                //Best framerate targeted (60 fps)
                createjs.Ticker.setFPS(60);

                createjs.Ticker.addEventListener('tick', handleTick);
            }

            /**
             * Creates a lemming
             * @returns {Object}
             */
            function createLemming() {
                var lemming = lemmings.create(stage, levelBitmap, levelObj, screen_width, screen_height);
                lemming_list.push(lemming);
                return lemming;
            }

            /**
             * @param {Object} event The tick event
             * Handles easeljs tick event
             * @returns {undefined}
             */
            function handleTick(event) {

                //console.log(createjs.Ticker.getMeasuredFPS(60));
                if (!event.paused) {
                    for (var i = 0; i < lemming_list.length; i++) {
                        lemming_list[i].tick();
                    }
                }

                //Add new lemming every certain amount of time
                var ticks = createjs.Ticker.getTicks();
                if (ticks % 300 === 0) {

                    if (lemming_list.length < MAX_LEMMINGS) {
                        var lemming = createLemming();

                        stage.addChild(lemming.fallAnimation);
                    }
                }

                //Update the stage                
                stage.update();
            }

        }
);

    