// ""visuals.js"

var FPS = 0;
var FPSText;

var FrameRate = 16;

var FrameCount = 0;

var CurrentTime = new Date().getTime();
var NextSecond = CurrentTime+1000;

var FPSmessage;

var TextSprites = new Array(100);
var CurrentTextSpriteIndex = 7;

var TextLeft = -1;
var TextCenter = 0;
var TextRight = 1;

var AndroidPortrait = 0;
var AndroidLandscape = 1;
var AndroidOrientation = null;

var index;

var ScreenFadeBlackBox = null;
var SixteenBitSoftLogo;
var titleBG, PDH4Logo, PixiJSLogo, FloppyDisk;

var PacDudeFrames = new Array(5);
for (index = 1; index < 5; index++)
{
	PacDudeFrames[index] = new Array(6);
}	

var PacDudePowerUp = new Array(5);
PacDudePowerUp[0] = null;
PacDudePowerUp[1] = null;
PacDudePowerUp[2] = null;
PacDudePowerUp[3] = null;
PacDudePowerUp[4] = null;

var GhostRedPlusEyes = new Array(2);
var PowerPellet;

var MsPacDude;
var GhostRedPlusEyesIntro = new Array(2);

var Legos = new Array(200);
var Pellets = new Array(200);
var PowerPellets = new Array(4);
for (index = 0; index < 4; index++)
{
	PowerPellets[index] = new Array(2);
}

var Ghosts = new Array(8);
for (index = 0; index < 8; index++)
{
	Ghosts[index] = new Array(4);
}

var GhostsEyes = new Array(8);
for (index = 0; index < 8; index++)
{
	GhostsEyes[index] = new Array(5);
}

var DebugGhostDir = new Array(1000);
for (index = 0; index < 1000; index++)
{
	DebugGhostDir[index] = new Array(6);
}

var LivesChararacter;

var PauseBG;

var TVScreen;

var EndGhost;
var EndPacDude;
var EndMsPacDude;
var EndPowerPellet;

var OnScreenDPad = new Array(4);
for (index = 0; index < 4; index++)
	OnScreenDPad[index] = null;

var AudioVolumeIcon = new Array(2);
var PauseIcon = new Array(3);

var CobraLogo;

var Audio5jsLogo;

var GamePadButton = new Array(2);
for (index = 0; index < 2; index++)
	GamePadButton[index] = null;

var GamePadBG;

var Star = new Array(100);
var StarActive = new Array(100);
var StarAlpha = new Array(100);
var StarScale = new Array(100);
var StarRotation = new Array(100);

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
//--------------------------------------------------------------------------------------------------------------
function SetupStars()
{
	for (var index = 0; index < 20; index++)
	{
		StarActive[index] = false;
		StarAlpha[index] = 0;
		StarScale[index] = 0;
		StarRotation[index] = 0;
		
		Star[index] = new PIXI.Sprite(id["Star.png"]);
		Star[index].anchor.set(0.5);
		Star[index].x = ( OriginalCanvasWidth/2 );
		Star[index].y = ( -700 );
		Star[index].scale.x = ( 0 );
		Star[index].scale.y = ( 0 );
		Star[index].rotation = ( Math.radians(0) );
		Star[index].alpha = 0;
		stage.addChild(Star[index]);
	}
}

//--------------------------------------------------------------------------------------------------------------
function DestroyStars()
{
	for (var index = 0; index < 20; index++)
	{
		stage.removeChild(Star[index]);
		StarActive[index] = true;
	}
}

//--------------------------------------------------------------------------------------------------------------
function ProcessStars()
{
	var newMouseX = Math.floor( MouseCoordinates.x / (widthScale) );
	var newMouseY = Math.floor( MouseCoordinates.y / (heightScale) );

	var newTouchTwoX = Math.floor( SecondTouchCoordinates.x / (widthScale) );
	var newTouchTwoY = Math.floor( SecondTouchCoordinates.y / (heightScale) );
	
	if (TouchScreen[0] === true)
	{
		for (index = 0; index < 20; index++)
		{
			if (StarActive[index] === false)
			{
				StarActive[index] = true;
				StarAlpha[index] = 1;
				StarScale[index] = 0;
				StarRotation[index] = 0;

				Star[index].x = ( newMouseX );
				Star[index].y = ( newMouseY );
				Star[index].scale.x = ( 0 );
				Star[index].scale.y = ( 0 );
				Star[index].rotation = (  Math.radians( Math.floor( Math.random() * 360 ) )  );
				Star[index].alpha = 1;
				
				index = 999;
			}
		}
	}
	
	if (isMobile === true && TouchScreen[1] === true)
	{
		for (index = 0; index < 20; index++)
		{
			if (StarActive[index] === false)
			{
				StarActive[index] = true;
				StarAlpha[index] = 1;
				StarScale[index] = 0;
				StarRotation[index] = 0;

				Star[index].x = ( newTouchTwoX );
				Star[index].y = ( newTouchTwoY );
				Star[index].scale.x = ( 0 );
				Star[index].scale.y = ( 0 );
				Star[index].rotation = (  Math.radians( Math.floor( Math.random() * 360 ) )  );
				Star[index].alpha = 1;
				
				index = 999;
			}
		}
	}
	
	for (index = 0; index < 20; index++)
	{
		if (StarActive[index] === true)
		{
			if (StarAlpha[index] > 0)
			{
				StarAlpha[index]-=.1;
				
				if (isMobile === false)  StarScale[index]+=.075;
				else  StarScale[index]+=.15;
			}
			else
			{
				StarActive[index] = false;
				StarAlpha[index] = 0;
				StarScale[index] = 0;
				StarRotation[index] = 0;
			}
		}
	}
	
	for (index = 0; index < 20; index++)
	{
		if (StarActive[index] === true)
		{
			Star[index].scale.x = ( StarScale[index] );
			Star[index].scale.y = ( StarScale[index] );
			Star[index].alpha = StarAlpha[index];
		}
	}
}

//--------------------------------------------------------------------------------------------------------------
function CheckAndroidOrientation()
{
	if (CurrentBrowserWidth < CurrentBrowserHeight)  AndroidOrientation = AndroidPortrait;
	else  AndroidOrientation = AndroidLandscape;

	return(AndroidOrientation);
}

//--------------------------------------------------------------------------------------------------------------
function CheckForBrowserResize(forceResize)
{
//	DONTRESIZE = true;
	
	if (DONTRESIZE === true)
	{
		renderer.resize( Math.floor(OriginalCanvasWidth), Math.floor(OriginalCanvasHeight) );
		renderer.view.style.position = 'absolute';
		renderer.view.style.left = 0;
		stage.scale.set( 1, 1 );
		
		return;
	}
	
	if (forceResize === false)
	{
		var oldBrowserWidth = CurrentBrowserWidth;
		var oldBrowserHeight = CurrentBrowserHeight;
	}
	
	if (window.innerWidth !== OriginalCanvasWidth || window.innerHeight !== OriginalCanvasHeight)
	{
		CurrentBrowserWidth = window.innerWidth;
		CurrentBrowserHeight = window.innerHeight;

		CheckAndroidOrientation();
		
		if (forceResize === true)
		{
			if (OriginalCanvasWidth > CurrentBrowserWidth)
			{
				widthScale = ( widthScale * (CurrentBrowserWidth / OriginalCanvasWidth) );
			}
			else if (OriginalCanvasWidth < CurrentBrowserWidth)
			{
				widthScale = ( widthScale * (CurrentBrowserWidth / OriginalCanvasWidth) );
			}
			
			if (OriginalCanvasHeight > CurrentBrowserHeight)
			{
				heightScale = ( heightScale * (CurrentBrowserHeight / OriginalCanvasHeight) );
			}
			else if (OriginalCanvasHeight < CurrentBrowserHeight)
			{
				heightScale = ( heightScale * (CurrentBrowserHeight / OriginalCanvasHeight) );
			}
		}
		else
		{
			if (oldBrowserWidth > CurrentBrowserWidth)
			{
				widthScale = ( widthScale * (CurrentBrowserWidth / oldBrowserWidth) );
			}
			else if (oldBrowserWidth < CurrentBrowserWidth)
			{
				widthScale = ( widthScale * (CurrentBrowserWidth / oldBrowserWidth) );
			}
			
			if (oldBrowserHeight > CurrentBrowserHeight)
			{
				heightScale = ( heightScale * (CurrentBrowserHeight / oldBrowserHeight) );
			}
			else if (oldBrowserHeight < CurrentBrowserHeight)
			{
				heightScale = ( heightScale * (CurrentBrowserHeight / oldBrowserHeight) );
			}
		}
		
		if (isMobile === false)
		{
			if (widthScale < heightScale)
			{
				CurrentBrowserHeight = CurrentBrowserHeight * (widthScale / heightScale);
				heightScale = widthScale;
			}
			else if (widthScale > heightScale)
			{
				CurrentBrowserWidth = CurrentBrowserWidth * (heightScale / widthScale);
				widthScale = heightScale;
			}
		}

		renderer.resize( Math.floor(OriginalCanvasWidth*widthScale), Math.floor(OriginalCanvasHeight*heightScale) );
		renderer.view.style.position = 'absolute';

		if (isMobile === false)  renderer.view.style.left = (  ( window.innerWidth - (renderer.width) ) >> 1  ) + 'px';
		else  renderer.view.style.left = ( 0 ) + 'px';

		stage.scale.set( widthScale, heightScale );
	}
}

//--------------------------------------------------------------------------------------------------------------
function LoadPlayingGameSprites()
{
	var fileName;
	var index;
	for (index = 0; index < 6; index++)
	{
		if (index < 5)  fileName = "Player_UP"+(index+1)+".png";
		else  fileName = "Player_Die.png";
		PacDudeFrames[UP][index] = new PIXI.Sprite(id[fileName]);
		PacDudeFrames[UP][index].anchor.set(0.5);
		PacDudeFrames[UP][index].x = ( OriginalCanvasWidth/2 );
		PacDudeFrames[UP][index].y = ( OriginalCanvasHeight+700 );
		stage.addChild(PacDudeFrames[UP][index]);
	}
	for (index = 0; index < 6; index++)
	{
		if (index < 5)  fileName = "Player_DOWN"+(index+1)+".png";
		else  fileName = "Player_Die.png";
		PacDudeFrames[DOWN][index] = new PIXI.Sprite(id[fileName]);
		PacDudeFrames[DOWN][index].anchor.set(0.5);
		PacDudeFrames[DOWN][index].x = ( OriginalCanvasWidth/2 );
		PacDudeFrames[DOWN][index].y = ( OriginalCanvasHeight+700 );
		stage.addChild(PacDudeFrames[DOWN][index]);
	}
	for (index = 0; index < 6; index++)
	{
		if (index < 5)  fileName = "Player_LEFT"+(index+1)+".png";
		else  fileName = "Player_Die.png";
		PacDudeFrames[LEFT][index] = new PIXI.Sprite(id[fileName]);
		PacDudeFrames[LEFT][index].anchor.set(0.5);
		PacDudeFrames[LEFT][index].x = ( OriginalCanvasWidth/2 );
		PacDudeFrames[LEFT][index].y = ( OriginalCanvasHeight+700 );
		stage.addChild(PacDudeFrames[LEFT][index]);
	}
	for (index = 0; index < 6; index++)
	{
		if (index < 5)  fileName = "Player_RIGHT"+(index+1)+".png";
		else  fileName = "Player_Die.png";
		PacDudeFrames[RIGHT][index] = new PIXI.Sprite(id[fileName]);
		PacDudeFrames[RIGHT][index].anchor.set(0.5);
		PacDudeFrames[RIGHT][index].x = ( OriginalCanvasWidth/2 );
		PacDudeFrames[RIGHT][index].y = ( OriginalCanvasHeight+700 );
		stage.addChild(PacDudeFrames[RIGHT][index]);
	}
	
	Ghosts[0][0] = new PIXI.Sprite(id["Ghost_Red1.png"]);
	Ghosts[0][0].anchor.set(0.5);
	Ghosts[0][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[0][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[0][0]);

	Ghosts[0][1] = new PIXI.Sprite(id["Ghost_Red2.png"]);
	Ghosts[0][1].anchor.set(0.5);
	Ghosts[0][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[0][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[0][1]);
	
	Ghosts[0][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[0][2].anchor.set(0.5);
	Ghosts[0][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[0][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[0][2]);

	Ghosts[0][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[0][3].anchor.set(0.5);
	Ghosts[0][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[0][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[0][3]);
	
	Ghosts[1][0] = new PIXI.Sprite(id["Ghost_Orange1.png"]);
	Ghosts[1][0].anchor.set(0.5);
	Ghosts[1][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[1][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[1][0]);

	Ghosts[1][1] = new PIXI.Sprite(id["Ghost_Orange2.png"]);
	Ghosts[1][1].anchor.set(0.5);
	Ghosts[1][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[1][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[1][1]);
	
	Ghosts[1][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[1][2].anchor.set(0.5);
	Ghosts[1][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[1][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[1][2]);

	Ghosts[1][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[1][3].anchor.set(0.5);
	Ghosts[1][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[1][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[1][3]);
	
	Ghosts[2][0] = new PIXI.Sprite(id["Ghost_Cyan1.png"]);
	Ghosts[2][0].anchor.set(0.5);
	Ghosts[2][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[2][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[2][0]);

	Ghosts[2][1] = new PIXI.Sprite(id["Ghost_Cyan2.png"]);
	Ghosts[2][1].anchor.set(0.5);
	Ghosts[2][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[2][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[2][1]);
	
	Ghosts[2][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[2][2].anchor.set(0.5);
	Ghosts[2][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[2][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[2][2]);

	Ghosts[2][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[2][3].anchor.set(0.5);
	Ghosts[2][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[2][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[2][3]);

	Ghosts[3][0] = new PIXI.Sprite(id["Ghost_Yellow1.png"]);
	Ghosts[3][0].anchor.set(0.5);
	Ghosts[3][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[3][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[3][0]);

	Ghosts[3][1] = new PIXI.Sprite(id["Ghost_Yellow2.png"]);
	Ghosts[3][1].anchor.set(0.5);
	Ghosts[3][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[3][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[3][1]);
	
	Ghosts[3][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[3][2].anchor.set(0.5);
	Ghosts[3][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[3][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[3][2]);

	Ghosts[3][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[3][3].anchor.set(0.5);
	Ghosts[3][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[3][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[3][3]);
	
	Ghosts[4][0] = new PIXI.Sprite(id["Ghost_Green1.png"]);
	Ghosts[4][0].anchor.set(0.5);
	Ghosts[4][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[4][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[4][0]);

	Ghosts[4][1] = new PIXI.Sprite(id["Ghost_Green2.png"]);
	Ghosts[4][1].anchor.set(0.5);
	Ghosts[4][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[4][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[4][1]);
	
	Ghosts[4][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[4][2].anchor.set(0.5);
	Ghosts[4][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[4][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[4][2]);

	Ghosts[4][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[4][3].anchor.set(0.5);
	Ghosts[4][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[4][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[4][3]);
	
	Ghosts[5][0] = new PIXI.Sprite(id["Ghost_Blue1.png"]);
	Ghosts[5][0].anchor.set(0.5);
	Ghosts[5][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[5][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[5][0]);

	Ghosts[5][1] = new PIXI.Sprite(id["Ghost_Blue2.png"]);
	Ghosts[5][1].anchor.set(0.5);
	Ghosts[5][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[5][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[5][1]);
	
	Ghosts[5][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[5][2].anchor.set(0.5);
	Ghosts[5][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[5][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[5][2]);

	Ghosts[5][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[5][3].anchor.set(0.5);
	Ghosts[5][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[5][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[5][3]);
	
	Ghosts[6][0] = new PIXI.Sprite(id["Ghost_Purple1.png"]);
	Ghosts[6][0].anchor.set(0.5);
	Ghosts[6][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[6][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[6][0]);

	Ghosts[6][1] = new PIXI.Sprite(id["Ghost_Purple2.png"]);
	Ghosts[6][1].anchor.set(0.5);
	Ghosts[6][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[6][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[6][1]);
	
	Ghosts[6][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[6][2].anchor.set(0.5);
	Ghosts[6][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[6][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[6][2]);

	Ghosts[6][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[6][3].anchor.set(0.5);
	Ghosts[6][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[6][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[6][3]);
	
	Ghosts[7][0] = new PIXI.Sprite(id["Ghost_Black1.png"]);
	Ghosts[7][0].anchor.set(0.5);
	Ghosts[7][0].x = ( OriginalCanvasWidth/2 );
	Ghosts[7][0].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[7][0]);

	Ghosts[7][1] = new PIXI.Sprite(id["Ghost_Black2.png"]);
	Ghosts[7][1].anchor.set(0.5);
	Ghosts[7][1].x = ( OriginalCanvasWidth/2 );
	Ghosts[7][1].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[7][1]);
	
	Ghosts[7][2] = new PIXI.Sprite(id["Ghost_Scared1.png"]);
	Ghosts[7][2].anchor.set(0.5);
	Ghosts[7][2].x = ( OriginalCanvasWidth/2 );
	Ghosts[7][2].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[7][2]);

	Ghosts[7][3] = new PIXI.Sprite(id["Ghost_Scared2.png"]);
	Ghosts[7][3].anchor.set(0.5);
	Ghosts[7][3].x = ( OriginalCanvasWidth/2 );
	Ghosts[7][3].y = ( OriginalCanvasHeight+700 );
	stage.addChild(Ghosts[7][3]);

	for (index = 0; index < 8; index++)
	{
		GhostsEyes[index][UP] = new PIXI.Sprite(id["Ghost_Eyes_UP.png"]);
		GhostsEyes[index][UP].anchor.set(0.5);
		GhostsEyes[index][UP].x = ( OriginalCanvasWidth/2 );
		GhostsEyes[index][UP].y = ( OriginalCanvasHeight+700 );
		stage.addChild(GhostsEyes[index][UP]);

		GhostsEyes[index][DOWN] = new PIXI.Sprite(id["Ghost_Eyes_DOWN.png"]);
		GhostsEyes[index][DOWN].anchor.set(0.5);
		GhostsEyes[index][DOWN].x = ( OriginalCanvasWidth/2 );
		GhostsEyes[index][DOWN].y = ( OriginalCanvasHeight+700 );
		stage.addChild(GhostsEyes[index][DOWN]);
		
		GhostsEyes[index][LEFT] = new PIXI.Sprite(id["Ghost_Eyes_LEFT.png"]);
		GhostsEyes[index][LEFT].anchor.set(0.5);
		GhostsEyes[index][LEFT].x = ( OriginalCanvasWidth/2 );
		GhostsEyes[index][LEFT].y = ( OriginalCanvasHeight+700 );
		stage.addChild(GhostsEyes[index][LEFT]);
		
		GhostsEyes[index][RIGHT] = new PIXI.Sprite(id["Ghost_Eyes_RIGHT.png"]);
		GhostsEyes[index][RIGHT].anchor.set(0.5);
		GhostsEyes[index][RIGHT].x = ( OriginalCanvasWidth/2 );
		GhostsEyes[index][RIGHT].y = ( OriginalCanvasHeight+700 );
		stage.addChild(GhostsEyes[index][RIGHT]);
	}
		
	PacDudePowerUp[UP] = new PIXI.Sprite(id["Player_UP3.png"]);
	PacDudePowerUp[UP].anchor.set(0.5);
	PacDudePowerUp[UP].x = ( OriginalCanvasWidth/2 );
	PacDudePowerUp[UP].y = ( OriginalCanvasHeight+700 );
	stage.addChild(PacDudePowerUp[UP]);
	PacDudePowerUp[DOWN] = new PIXI.Sprite(id["Player_DOWN3.png"]);
	PacDudePowerUp[DOWN].anchor.set(0.5);
	PacDudePowerUp[DOWN].x = ( OriginalCanvasWidth/2 );
	PacDudePowerUp[DOWN].y = ( OriginalCanvasHeight+700 );
	stage.addChild(PacDudePowerUp[DOWN]);
	PacDudePowerUp[LEFT] = new PIXI.Sprite(id["Player_LEFT3.png"]);
	PacDudePowerUp[LEFT].anchor.set(0.5);
	PacDudePowerUp[LEFT].x = ( OriginalCanvasWidth/2 );
	PacDudePowerUp[LEFT].y = ( OriginalCanvasHeight+700 );
	stage.addChild(PacDudePowerUp[LEFT]);
	PacDudePowerUp[RIGHT] = new PIXI.Sprite(id["Player_RIGHT3.png"]);
	PacDudePowerUp[RIGHT].anchor.set(0.5);
	PacDudePowerUp[RIGHT].x = ( OriginalCanvasWidth/2 );
	PacDudePowerUp[RIGHT].y = ( OriginalCanvasHeight+700 );
	stage.addChild(PacDudePowerUp[RIGHT]);
	
	for (index = 0; index < 1000; index++)
	{
		DebugGhostDir[index][UP] = new PIXI.Sprite(id["DebugUP.png"]);
		DebugGhostDir[index][UP].anchor.set(0.5);
		DebugGhostDir[index][UP].x = ( OriginalCanvasWidth/2 );
		DebugGhostDir[index][UP].y = ( OriginalCanvasHeight+700 );
		DebugGhostDir[index][UP].alpha = .15;
		if (SecretCodeTotal === 4777)  stage.addChild(DebugGhostDir[index][UP]);

		DebugGhostDir[index][DOWN] = new PIXI.Sprite(id["DebugDOWN.png"]);
		DebugGhostDir[index][DOWN].anchor.set(0.5);
		DebugGhostDir[index][DOWN].x = ( OriginalCanvasWidth/2 );
		DebugGhostDir[index][DOWN].y = ( OriginalCanvasHeight+700 );
		DebugGhostDir[index][DOWN].alpha = .15;
		if (SecretCodeTotal === 4777)  stage.addChild(DebugGhostDir[index][DOWN]);
		
		DebugGhostDir[index][LEFT] = new PIXI.Sprite(id["DebugLEFT.png"]);
		DebugGhostDir[index][LEFT].anchor.set(0.5);
		DebugGhostDir[index][LEFT].x = ( OriginalCanvasWidth/2 );
		DebugGhostDir[index][LEFT].y = ( OriginalCanvasHeight+700 );
		DebugGhostDir[index][LEFT].alpha = .15;
		if (SecretCodeTotal === 4777)  stage.addChild(DebugGhostDir[index][LEFT]);
		
		DebugGhostDir[index][RIGHT] = new PIXI.Sprite(id["DebugRIGHT.png"]);
		DebugGhostDir[index][RIGHT].anchor.set(0.5);
		DebugGhostDir[index][RIGHT].x = ( OriginalCanvasWidth/2 );
		DebugGhostDir[index][RIGHT].y = ( OriginalCanvasHeight+700 );
		DebugGhostDir[index][RIGHT].alpha = .15;
		if (SecretCodeTotal === 4777)  stage.addChild(DebugGhostDir[index][RIGHT]);

		DebugGhostDir[index][5] = new PIXI.Sprite(id["DebugANY.png"]);
		DebugGhostDir[index][5].anchor.set(0.5);
		DebugGhostDir[index][5].x = ( OriginalCanvasWidth/2 );
		DebugGhostDir[index][5].y = ( OriginalCanvasHeight+700 );
		DebugGhostDir[index][5].alpha = .15;
		if (SecretCodeTotal === 4777)  stage.addChild(DebugGhostDir[index][5]);
	}
	
	LivesChararacter = new PIXI.Sprite(id["Player_RIGHT3.png"]);
	LivesChararacter.anchor.set(0.5);
	LivesChararacter.x = ( OriginalCanvasWidth/2 );
	LivesChararacter.y = ( OriginalCanvasHeight+700 );
	LivesChararacter.scale.x = .5;
	LivesChararacter.scale.y = .5;
	stage.addChild(LivesChararacter);
}

//--------------------------------------------------------------------------------------------------------------
function UnloadPlayingGameSprites()
{
	var index;
	var indexTwo;

	for (index = 0; index < 6; index++)
	{
		stage.removeChild(PacDudeFrames[UP][index]);
	}
	for (index = 0; index < 6; index++)
	{
		stage.removeChild(PacDudeFrames[DOWN][index]);
	}
	for (index = 0; index < 6; index++)
	{
		stage.removeChild(PacDudeFrames[LEFT][index]);
	}
	for (index = 0; index < 6; index++)
	{
		stage.removeChild(PacDudeFrames[RIGHT][index]);
	}

	for (index = 0; index < 8; index++)
	{
		stage.removeChild(Ghosts[index][0]);
		stage.removeChild(Ghosts[index][1]);
		stage.removeChild(Ghosts[index][2]);
		stage.removeChild(Ghosts[index][3]);
	}
		
	for (index = 0; index < 8; index++)
	{
		for (indexTwo = 0; indexTwo < 5; indexTwo++)
		{
			stage.removeChild(GhostsEyes[index][indexTwo]);
		}
	}
	
	stage.removeChild(PacDudePowerUp[UP]);
	stage.removeChild(PacDudePowerUp[DOWN]);
	stage.removeChild(PacDudePowerUp[LEFT]);
	stage.removeChild(PacDudePowerUp[RIGHT]);

	for (index = 0; index < 1000; index++)
	{
		stage.removeChild(DebugGhostDir[index][UP]);

		stage.removeChild(DebugGhostDir[index][DOWN]);
		
		stage.removeChild(DebugGhostDir[index][LEFT]);
		
		stage.removeChild(DebugGhostDir[index][RIGHT]);

		stage.removeChild(DebugGhostDir[index][5]);
	}

	stage.removeChild(LivesChararacter);
}

//--------------------------------------------------------------------------------------------------------------
function NullifyAllTexts()
{
	var index;
	for (index = 7; index < 100; index++)  TextSprites[index] = null;

	for (index = 0; index < 7; index++)
	{
		TextSprites[ OptionsTexts[index] ] = null;
		OptionsTexts[index] = null;
	}
	
	FPSmessage = null;
}

//--------------------------------------------------------------------------------------------------------------
function RemoveAllTextsOnScreen()
{
	var index;
	for (index = 7; index < 100; index++)
	{
		if (TextSprites[index] !== null)  stage.removeChild(TextSprites[index]);
	}

	NullifyAllTexts();

	CurrentTextSpriteIndex = 7;
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {number}
 */
function PlaceTextOntoScreen(size, justification, texts, screenX, screenY, rFillT, gFillT, bFillT, rFillB, gFillB, bFillB, rOutline, gOutline, bOutline, alphaVal, outlineThinkness)
{
	var style = new PIXI.TextStyle({
		font: "FreeSans",
		fontSize: size,
		lineJoin: 'round',
		fill: [PIXI.utils.rgb2hex([rFillT, gFillT, bFillT]), PIXI.utils.rgb2hex([rFillB, gFillB, bFillB])],
		stroke: PIXI.utils.rgb2hex([rOutline, gOutline, bOutline]),
		strokeThickness: outlineThinkness
	});

	TextSprites[CurrentTextSpriteIndex] = new PIXI.Text( texts, style );

	screenX+=.5;
	screenY+=.5;

	if (justification === TextLeft)  TextSprites[CurrentTextSpriteIndex].position.set(screenX + (TextSprites[CurrentTextSpriteIndex].width/2), screenY);
	else if (justification === TextCenter)  TextSprites[CurrentTextSpriteIndex].position.set(screenX, screenY );
	else if (justification === TextRight)  TextSprites[CurrentTextSpriteIndex].position.set( (OriginalCanvasWidth - screenX - (TextSprites[CurrentTextSpriteIndex].width/2) ), screenY );

	TextSprites[CurrentTextSpriteIndex].alpha = alphaVal;
	TextSprites[CurrentTextSpriteIndex].anchor.set(0.5);
	
	stage.addChild(TextSprites[CurrentTextSpriteIndex]);

	if (CurrentTextSpriteIndex < 100)  CurrentTextSpriteIndex++;
	return(CurrentTextSpriteIndex-1);
}
