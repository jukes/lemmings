requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    shim: {
        easeljs: {
            exports: 'createjs'
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

requirejs(['my/assetsHolder', 'easeljs', 'my/lemmings'],
        function(assetsHolder, createjs, lemmings) {

            var canvas;
            var stage;
            var screen_width;
            var screen_height;
            var lemming_list = [];

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

                //Initialize lemming sprites
                lemmings.init();

                var lemming = createLemming();
                stage.addChild(lemming.walkAnimation);

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
                var lemming = lemmings.create(stage, screen_width, screen_height);
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

                    if (lemming_list.length < 10) {
                        var lemming = createLemming();

                        stage.addChild(lemming.walkAnimation);
                    }
                }
                
                //Update the stage                
                stage.update();
            }

        }
);

    