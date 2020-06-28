// "initialize.js"

let DONTRESIZE = true;//false;

let OriginalCanvasWidth = 640;
let OriginalCanvasHeight = 480;

let CurrentBrowserWidth = (window.innerWidth + 1);
let CurrentBrowserHeight = (window.innerHeight + 1);

let widthScale = 1;
let heightScale = 1;

let isMobile = false;
let AndroidChrome = false;
let AndroidFirefox = false;

let MouseCoordinates = new PIXI.Point;

let Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.Loader.shared,
	resources = PIXI.Loader.shared.resources,
	TextureCache = PIXI.utils.TextureCache,
	Texture = PIXI.Texture,
	Sprite = PIXI.Sprite,
	Text = PIXI.Text,
	Graphics = PIXI.Graphics;

const renderer = new PIXI.Renderer({ width: OriginalCanvasWidth, height: OriginalCanvasHeight, transparent: false, autoDensity: true });

let stage;
let id;

let TouchNone = 0;
let TouchStart = 1;
let TouchEnd = 2;
let TouchCancel = 3;
let TouchMove = 4;
let TouchInput = TouchNone;

let SecondTouchCoordinates = new PIXI.Point;

//--------------------------------------------------------------------------------------------------------------
function SetFrameRate()
{
	if (GameMode === VerySlowMode)  FrameRate = 90;
	else if (GameMode === SlowMode)  FrameRate = 60;
	else if (GameMode === NormalMode)  FrameRate = 34;
	else if (GameMode === FastMode)  FrameRate = 20;
	else if (GameMode === VeryFastMode)  FrameRate = 10;
}
	
//--------------------------------------------------------------------------------------------------------------
function setup()
{
//	PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;

	if (  (typeof window.orientation !== "undefined") || ( navigator.userAgent.indexOf('IEMobile') !== -1 )  )  isMobile = true;
	
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )  AndroidChrome = true;
	
	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 )  AndroidFirefox = true;
	
	if (isMobile === true)  OriginalCanvasHeight = 1138-200;
/*
	let app = new PIXI.Application(OriginalCanvasWidth, OriginalCanvasHeight, {backgroundColor: "Black"});
	document.body.appendChild(app.view);
		
//	renderer = new PIXI.Renderer({ width: OriginalCanvasWidth, height: OriginalCanvasHeight, transparent: false, autoDensity: true });
	document.body.appendChild(renderer.view);
		
	stage = new Container();
	id = resources["images/PacDude4.json"].textures;
*/

	const app = new PIXI.Application({
		width: 640, height: 480, backgroundColor: "Black", resolution: window.devicePixelRatio || 1,
	});
	document.body.appendChild(app.view);

	document.body.appendChild(renderer.view);

	const container = new PIXI.Container();
	app.stage.addChild(container);

	stage = new Container();
	id = resources["images/PacDude4.json"].textures;




	if (isMobile === false)
	{
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
	}

	SixteenBitSoftLogo = null;
	
	titleBG = null;
	PDH4Logo = null;
	PixiJSLogo = null;
	FloppyDisk = null;

	Button[0] = null;
	Button[1] = null;
	Button[2] = null;
	Button[3] = null;
	Button[4] = null;
	Button[5] = null;
	Button[6] = null;
	ButtonLeftArrow = null;
	ButtonRightArrow = null;

	InitializeHighScores();
	
	NullifyAllTexts();

	CheckForBrowserResize(true);
	
	document.addEventListener("keypress", CheckForKeyPress, true);
	document.addEventListener("keydown", CheckForKeyDown, true);
	document.addEventListener("keyup", CheckForKeyRelease, true);

	window.addEventListener("keydown", function(e) {
		// space and arrow keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);	

	if (isMobile === false)
	{
		renderer.plugins.interaction.on('pointerdown', function(event) {
			MouseCoordinates = event.data.global;
			TouchScreen[0] = true;
		});

		renderer.plugins.interaction.on('pointerup', function(event) {
			TouchScreen[0] = false;
		});
	}
	else
	{
		renderer.plugins.interaction.on('touchstart', function (event)
		{ TouchInput = TouchStart; TouchScreen[event.data.identifier] = true; if (event.data.identifier === 0)  MouseCoordinates = event.data.global; else SecondTouchCoordinates = event.data.global; }, false);
		
		renderer.plugins.interaction.on('touchend', function (event)
		{ TouchInput = TouchEnd; TouchScreen[event.data.identifier] = false; }, false);
		
		renderer.plugins.interaction.on('touchcancel', function (event)
		{ TouchInput = TouchCancel; TouchScreen[event.data.identifier] = false; }, false);
		
		renderer.plugins.interaction.on('touchmove', function (event)
		{ TouchInput = TouchMove; TouchScreen[event.data.identifier] = true; if (event.data.identifier === 0)  MouseCoordinates = event.data.global; else SecondTouchCoordinates = event.data.global; }, false);
	}

	state = play;

	LoadHighScoresAndOptions();
	
//	SetVolumeOfAudioEngine();
//	PlayMusic("BGM-Test");

	FrameRate = 19;
	
//	enableNoSleep();
	
	gameLoop();
}

//--------------------------------------------------------------------------------------------------------------
loader
	.add("images/PacDude4.json")
	.load(setup);
