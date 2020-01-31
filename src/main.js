const WIDTH = 480;
const HEIGHT = 320;
const APP_FPS = 30;

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});
let canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta = 60 / APP_FPS;

let elapsedTime = 0;
let bg;
let cat;
let isCatDragging = false;

let container = new PIXI.Container();
container.width = 480;
container.height = 320;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
container.interactiveChildren = true;
app.stage.addChild(container);

// asset property
const ASSET_BG = "images/pic_bg.jpg";
const ASSET_CAT = "images/pic_cat.png";

PIXI.loader
  .add("bg_data", ASSET_BG)
  .add("cat_data", ASSET_CAT)
  .load(onAssetsLoaded);

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  // BG
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;

  // CAT
  cat = new PIXI.Sprite(res.cat_data.texture);
  container.addChild(cat);
  cat.x = WIDTH / 2 - cat.width / 2;
  cat.y = HEIGHT / 2 - cat.height / 2;
  cat.interactive = true;
  cat.buttonMode = true;
  cat.anchor.set(0.5);
  cat.scale.set(1);
  cat.on("pointerdown", onDragStart);
  cat.on("pointerup", onDragEnd);
  cat.on("pointerupoutside", onDragEnd);
  cat.on("pointermove", onDragMove);

  // Text
  let text = new PIXI.Text("Drag and Drop Test\n(PixiJS 4.8.9)", {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0xf0fff0,
    align: "center",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text);
  text.x = WIDTH / 2 - text.width / 2;
  text.y = 20;

  // Ticker
  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);
}

/**
 * start drag
 * @param { object } e
 */
let onDragStart = e => {
  console.log("onDragStart()", e);
  cat.tint = 0x99999;
  isCatDragging = true;
};

/**
 * stop drag
 */
let onDragEnd = e => {
  console.log("onDragEnd()", e);
  cat.tint = 0xffffff;
  isCatDragging = false;
};

/**
 * move drag
 */
let onDragMove = e => {
  console.log("onDragMove()", e);
  if (isCatDragging) {
    // cat.x = app.renderer.plugins.interaction.mouse.global.x;
    // cat.y = app.renderer.plugins.interaction.mouse.global.y;
    position = e.data.global;
    cat.x = position.x;
    cat.y = position.y;
  }
};

/**
 * adjust fps
 * @param { number } delta time
 */
const tick = delta => {
  // console.log(delta);
  elapsedTime += delta;

  if (elapsedTime >= fpsDelta) {
    //enough time passed, update app
    update(elapsedTime);
    //reset
    elapsedTime = 0;
  }
};

/**
 * app rendering
 * @param { number } delta time
 */
const update = delta => app.render();
