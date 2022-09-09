function implement(posx, posy, rot, active, name, toolType, ax, ay, inventory, reference, machinesFunction) {
    this.posx = posx;
    this.posy = posy;
    this.rot = rot;
    this.active = active;
    this.name = name;
    this.toolType = toolType;
    this.ax = ax;
    this.ay = ay;
    this.inventory = inventory;
    this.reference = reference;
    this.machinesFunction = machinesFunction;
}

function tile(state, willGrow, tillGrown, yield, cropType) {
    this.state = state;
    this.willGrow = willGrow;
    this.tillGrown = tillGrown;
    this.yield = yield;
    this.cropType = cropType;
}

function vehicle(posx, posy, rotation, attachedImplement, implementAttached, fuel, name, aoX, aoY, inventory, reference) {
    this.posx = posx;
    this.posy = posy;
    this.rotation = rotation;
    this.attachedImplement = attachedImplement;
    this.implementAttached = implementAttached;
    this.fuel = fuel;
    this.name = name;
    this.aoX = aoX;
    this.aoY = aoY;
    this.inventory = inventory;
    this.reference = reference;
}

function item(name, amount) {
    this.name = name;
    this.amount = amount;
}

function prompt(posx, posy, width, height, elements) {
    this.posx = posx;
    this.posy = posy;
    this.width = width;
    this.height = height;
    this.elements = elements;
}

function element(text, action) {
    this.text = text;
    this.action = action;
}

function specialLocation(posx, posy, property) {
    this.posx = posx;
    this.posy = posy;
    this.property = property;
}

function machine(name, price, size, type, image, attachableTo) {
    this.name = name;
    this.price = price;
    this.size = size;
    this.type = type;
    this.image = image;
    this.attachableTo = attachableTo;
}

function prop(price, name) {
    this.price = price;
    this.name = name;
}

function pos2d(x, y) {
    this.x = x;
    this.y = y;
}

function machineFunction(initial, final) {
    this.initial = initial;
    this.final = final;
}

const spriteSize = 16;
const c = document.getElementById("main");
const button = document.querySelector("#main");
button.addEventListener("click", mouseClick, false);
const painter = c.getContext("2d", { alpha: false });
var rendererOffset = 8;
painter.translate(rendererOffset, rendererOffset);
painter.imageSmoothingEnabled = false;

const width = c.width;
const height = c.height;
const centerX = width / 2;
const centerY = height / 2;

var pointerX = 0;
var pointerY = 0;

var chunkX = 0;
var chunkY = 0;

const canvasSize = width / spriteSize;
const mapSize = canvasSize * 8;
const mapScale = 8;

var animalImages = new Array();
var amountOfAnimals = 1;
fillImageArray(animalImages, amountOfAnimals);

animalImages[0].src = `/${spriteSize}xSprites/Cow.png`;

var machines = new Array();
var amountOfMachines = 9;
fillImageArray(machines, amountOfMachines);

machines[0].src = `/${spriteSize}xSprites/Tractor.png`;
machines[1].src = `/${spriteSize}xSprites/Cultivator.png`;
machines[2].src = `/${spriteSize}xSprites/Planter.png`;
machines[3].src = `/${spriteSize}xSprites/Harvester.png`;
machines[4].src = `/${spriteSize}xSprites/GrainHeader.png`;
machines[5].src = `/${spriteSize}xSprites/LargeCultivator.png`;
machines[6].src = `/${spriteSize}xSprites/GrainTrailer.png`;
machines[7].src = `/${spriteSize}xSprites/LargePlanter.png`;
machines[8].src = `/${spriteSize}xSprites/Spreader.png`;

var props = new Array();
var amountOfProps = 4;

props[0] = new prop(15000, "Sell Point");
props[1] = new prop(150, "Fence Horizontal");
props[2] = new prop(150, "Fence Vertical");
props[3] = new prop(200, "Fence Cross");

var icons = new Array();
var amountOfIcons = 1;
fillImageArray(icons, amountOfIcons);

icons[0].src = `/Icons/bulldozer.png`;

var blocks = [[new tile()]];

var specialLocations = new Array();

var normalPrompts = new Array();
var buildPrompts = new Array();
var farmMoney = 225000;

var implements = new Array();
var activeVehicle = 0;
var vehicles = new Array();

var buildType = 7;

var tileImages = new Array();
var amountOfCrops = 11;
fillImageArray(tileImages, amountOfCrops);

tileImages[0].src = `/${spriteSize}xSprites/Grass.png`; /////////////// 0 Grass
tileImages[1].src = `/${spriteSize}xSprites/Cultivated.png`; ////////// 1 Cultivated
tileImages[2].src = `/${spriteSize}xSprites/PlantedStage1.png`; /////// 2 Planted 1
tileImages[3].src = `/${spriteSize}xSprites/PlantedStage3.png`; /////// 3 Planted 3
tileImages[4].src = `/${spriteSize}xSprites/PlantedStage5.png`; /////// 4 Planted 5
tileImages[5].src = `/${spriteSize}xSprites/PlantedStage6.png`; /////// 5 Planted 6
tileImages[6].src = `/${spriteSize}xSprites/Harvested.png`; /////////// 6 Harvested
tileImages[7].src = `/${spriteSize}xSprites/SellPoint.png`; /////////// 7 Sellpoint
tileImages[8].src = `/${spriteSize}xSprites/Fence-Horizontal.png`; //// 8 Fence
tileImages[9].src = `/${spriteSize}xSprites/Fence-Vertical.png`; ////// 9 Fence
tileImages[10].src = `/${spriteSize}xSprites/Fence-Cross.png`; /////// 10 Fence

var purchaseableEquipment = new Array();
// list of all the machines within the game
// to add more machines add the sprite to the machines list above and add a purchaseable equipment item to the list below
purchaseableEquipment[0] = new machine("Tractor", 50000, "Small", "vehicle", machines[0], null);
purchaseableEquipment[1] = new machine("Harvester", 75000, "Small", "vehicle", machines[3], null);
purchaseableEquipment[2] = new machine("Header", 15000, "Small", "implement", machines[4], "Harvester");
purchaseableEquipment[3] = new machine("Disc Harrow", 25000, "Small", "implement", machines[1], "Tractor");
purchaseableEquipment[4] = new machine("Planter", 25000, "Small", "implement", machines[2], "Tractor");
purchaseableEquipment[5] = new machine("Grain Trailer", 25000, "Small", "implement", machines[6], "Tractor");
purchaseableEquipment[6] = new machine("Disc Harrow", 50000, "Large", "implement", machines[5], "Tractor");
purchaseableEquipment[7] = new machine("Planter", 50000, "Large", "implement", machines[7], "Tractor");
purchaseableEquipment[8] = new machine("Spreader", 35000, "Large", "implement", machines[8], "Tractor");

var machineFunctions = new Array();

machineFunctions[0] = new machineFunction([0, 2, 3, 4, 5, 6], [1]); // Disc Harrow & Cultivators
machineFunctions[1] = new machineFunction([1], [2]); // Planters & Seeders
machineFunctions[2] = new machineFunction([5], [6]); // Headers
machineFunctions[3] = new machineFunction([1, 2, 3, 4, 5, 6], [-0.5]); // Spreaders & Sprayers

var renderMode = "Setup";

var debugOn = false;

var targetFps = 60;
var actualFps;

var frame = 0;

function setup() {
    if (vehicles[0] == null) {
        renderMode = "Setup";
    }
    // create basic map
    normalPrompts[normalPrompts.length] = new prompt(50, 60, 412, 60, [new element("Please Buy A Vehicle To Get Started", null)]);
    showControls();

    for (var y = 0; y <= mapSize; y++) {
        blocks[y] = [];
        for (var x = 0; x <= mapSize; x++) {
            blocks[y][x] = new tile(0, false, null, null);
        }
    }
    setTimeout(renderMap, 100);
}

var lastLoop = performance.now();
function update() {
    if (renderMode == "Setup") {
        normalUserInterface();
    } else if (renderMode == "Normal") {
        updateMap();
        paintMachines();
        normalUserInterface();
        applyImplements();
    } else if (renderMode == "Build") {
        updateMap();
        paintMachines();
        buildUserInterface();
    }

    if (debugOn) {
        debugMenu();
    }

    computeFrame();

    var thisLoop = performance.now();
    actualFps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
}

function computeFrame() {
    if (frame >= targetFps) {
        frame = targetFps - frame;
    } else {
        frame++;
    }
}

function buildUserInterface() {
    displayFarmMoney();
    displayBuildPrompts();
}

function screenshot() {
    let canvasUrl = c.toDataURL();
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    var todayDate = new Date().toISOString().slice(0, 10);
    createEl.download = `Screenshot_${todayDate}`;
    createEl.click();
    createEl.remove();
}

function adjustChunk() {
    if (chunkX != Math.floor(vehicles[activeVehicle].posx / canvasSize)) {
        renderMap();
        chunkX = Math.floor(vehicles[activeVehicle].posx / canvasSize);
    }
    if (chunkY != Math.floor(vehicles[activeVehicle].posy / canvasSize)) {
        renderMap();
        chunkY = Math.floor(vehicles[activeVehicle].posy / canvasSize);
    }
}

function screenToWorld(pos) {
    return Math.floor(pos / spriteSize);
}

function calculateGrainCost(amount) {
    return amount * 5 - amount * 0.5;
}

function calculateFertilizerCost(amount) {
    return amount * 7 - amount * 0.5;
}

function fillImageArray(array, number) {
    for (var i = 0; i < number; i++) {
        array[i] = new Image();
    }
}

function showControls() {
    normalPrompts[normalPrompts.length] = new prompt(50, 130, 412, 285, [
        new element("N Opens Vehicle Buy Menu"),
        new element("B Opens Seed Buy Menu"),
        new element("P Fixes Stuck Tools and Render Glitches"),
        new element("E Switches Vehicles"),
        new element("Q Attaches Implements"),
        new element("V Activates Implements"),
        new element("C Shows Controls"),
        new element("M Turns On Build Mode"),
        new element("     ↳ While In Build Mode Use B To Bulldoze Props"),
        new element("X Takes A Screenshot"),
    ]);
}

function paintMachines() {
    for (var i = 0; i < vehicles.length; i++) {
        paintMachine(vehicles[i]);
    }
    for (var i = 0; i < implements.length; i++) {
        paintMachine(implements[i]);
    }
}

function paintMachine(object) {
    var osX = chunkX * spriteSize * canvasSize;
    var osY = chunkY * spriteSize * canvasSize;

    if (object.reference.type == "implement") {
        if (object.ax >= 0 || object.ay >= 0) {
            var implementPos = rotatePointAroundPoint(new pos2d(object.posx, object.posy), new pos2d(object.posx + object.ax, object.posy + 1), object.rot);
            paintImage(object.reference.image, spriteSize * implementPos.x - osX, spriteSize * implementPos.y - osY, object.rot);
        } else {
            paintImage(object.reference.image, spriteSize * object.posx - osX, spriteSize * object.posy - osY, object.rot);
        }
    } else if (object.reference.type == "vehicle") {
        paintImage(object.reference.image, spriteSize * object.posx - osX, spriteSize * object.posy - osY, object.rotation);
    }
}

function normalUserInterface() {
    // ui
    // tool display box
    roundedRect(0, 0, 512 - 16 - 100, 20, 5, 0, 0, 0);
    // position display box
    roundedRect(512 - 16 - 100 + 10, 0, 90, 20, 5, 0, 0, 0);

    // tool display computing
    var at;
    var bt;
    if (vehicles[0] != null) {
        if (vehicles[activeVehicle].implementAttached) {
            if (implements[vehicles[activeVehicle].attachedImplement].active) {
                ct = "Tool On";
            } else {
                ct = "Tool Off";
            }
            if (implements[vehicles[activeVehicle].attachedImplement].inventory != null) {
                at =
                    ", " +
                    implements[vehicles[activeVehicle].attachedImplement].name +
                    ": " +
                    implements[vehicles[activeVehicle].attachedImplement].inventory.name +
                    ", " +
                    implements[vehicles[activeVehicle].attachedImplement].inventory.amount +
                    " [" +
                    ct +
                    "]";
            } else {
                at = ", " + implements[vehicles[activeVehicle].attachedImplement].name + " [" + ct + "]";
            }
        } else {
            at = "";
        }
        if (vehicles[activeVehicle].inventory == null) {
            bt = "";
        } else {
            bt = ": " + vehicles[activeVehicle].inventory.name + ", " + vehicles[activeVehicle].inventory.amount;
        }

        // tool display
        drawText(vehicles[activeVehicle].name + bt + at, 5, 15, 255, 255, 255);
        drawText(vehicles[activeVehicle].posx + ", " + vehicles[activeVehicle].posy, 512 - 16 - 80, 15, 255, 255, 255);
    }

    // show prompts
    displayFarmMoney();
    displayNormalPrompts();
}

function displayFarmMoney() {
    // money display box
    roundedRect(512 - 16 - 100 + 10, 25, 90, 20, 5, 0, 0, 0);
    drawText("$" + farmMoney, 512 - 16 - 80, 40, 255, 255, 255);
}

function applyImplements() {
    if (vehicles[activeVehicle].implementAttached) {
        if (implements[vehicles[activeVehicle].attachedImplement].active) {
            var activeImplement = implements[vehicles[activeVehicle].attachedImplement];
            switch (implements[vehicles[activeVehicle].attachedImplement].name) {
                case "Planter":
                    applyImplement(activeImplement, vehicles[activeVehicle]);
                    break;
            }
        }
    }
}

// to fix the bugged rendering and application of implements digitally offset where the implements left bound is and rendering starts by its ax and ay offset
function applyImplement(target, source) {
    if (target.ax >= 1 || target.ay >= 1) {
        // Non small implement
        var tilesCovered = new Array();
        for (var i = -target.ax; i <= target.ax; i++) {
            // tilesCovered[i] = new pos2d(target.posx + i, target.posy + target.ay);
            tilesCovered[i + 1] = rotatePointAroundPoint(new pos2d(target.posx + i, target.posy + target.ay), new pos2d(source.posx, source.posy), target.rot);
        }
        console.log(tilesCovered);
    } else {
        // Small implement
        if (target.machinesFunction.initial.includes(blocks[target.posy][target.posx].state)) {
            if (target.machineFunction.final >= 0) {
                blocks[target.posy][target.posx].state = target.machineFunction.final;
            } else {
                blocks[target.posy][target.posx].yield += target.machineFunction.final * -1;
            }
        }
    }
}

function spinCow(location2D) {
    var cowPos = rotatePointAroundPoint(new pos2d(location2D.x - 1, location2D.y), location2D, frame * (360 / targetFps));
    paintImage(animalImages[0], cowPos.x * spriteSize, cowPos.y * spriteSize, frame * (360 / targetFps) - 90);
}

function rotatePointAroundPoint(originalPoint, axis, angle) {
    // Negatively Offset Dependant Point By Axis Point
    var point3 = new pos2d(originalPoint.x - axis.x, originalPoint.y - axis.y);
    // Rotate Dependant Point By Angle
    var point4 = new pos2d(point3.x * Math.cos(toRadian(angle)) - point3.y * Math.sin(toRadian(angle)), point3.y * Math.cos(toRadian(angle)) + point3.x * Math.sin(toRadian(angle)));
    // Positively Offset Dependant Point By Axis Point
    var finalPoint = new pos2d(axis.x + point4.x, axis.y + point4.y);
    // Return Rotated Point
    return finalPoint;
}

function displayNormalPrompts() {
    for (var i = 0; i < normalPrompts.length; i++) {
        if (normalPrompts[i] != null) {
            roundedRect(normalPrompts[i].posx, normalPrompts[i].posy, normalPrompts[i].width, normalPrompts[i].height, 5, 0, 0, 0);
            roundedRect(normalPrompts[i].posx + 10, normalPrompts[i].posy + 10, 20, 14, 7, 255, 0, 0);
            drawText("X", normalPrompts[i].posx + 15, normalPrompts[i].posy + 10 + 11, 255, 255, 255);
            for (var j = 0; j < normalPrompts[i].elements.length; j++) {
                if (normalPrompts[i].elements[j].action == null) {
                    roundedRect(normalPrompts[i].posx + 10, 5 + normalPrompts[i].posy + (j + 1) * 25, normalPrompts[i].width - 20, 20, 8, 50, 50, 50);
                    drawText(normalPrompts[i].elements[j].text, normalPrompts[i].posx + 20, 20 + normalPrompts[i].posy + (j + 1) * 25, 255, 255, 255);
                } else if (normalPrompts[i].elements[j].action != null) {
                    roundedRect(normalPrompts[i].posx + 10, 5 + normalPrompts[i].posy + (j + 1) * 25, normalPrompts[i].width - 20, 20, 8, 100, 100, 100);
                    drawText(normalPrompts[i].elements[j].text, normalPrompts[i].posx + 20, 20 + normalPrompts[i].posy + (j + 1) * 25, 255, 255, 255);
                }
            }
        }
    }
}

function displayBuildPrompts() {
    for (var i = 0; i < buildPrompts.length; i++) {
        if (buildPrompts[i] != null) {
            roundedRect(buildPrompts[i].posx, buildPrompts[i].posy, buildPrompts[i].width, buildPrompts[i].height, 5, 0, 0, 0);
            roundedRect(buildPrompts[i].posx + 10, buildPrompts[i].posy + 10, 20, 14, 7, 255, 0, 0);
            drawText("X", buildPrompts[i].posx + 15, buildPrompts[i].posy + 10 + 11, 255, 255, 255);
            for (var j = 0; j < buildPrompts[i].elements.length; j++) {
                if (buildPrompts[i].elements[j].action == null) {
                    roundedRect(buildPrompts[i].posx + 10, 5 + buildPrompts[i].posy + (j + 1) * 25, buildPrompts[i].width - 20, 20, 8, 50, 50, 50);
                    drawText(buildPrompts[i].elements[j].text, buildPrompts[i].posx + 20, 20 + buildPrompts[i].posy + (j + 1) * 25, 255, 255, 255);
                } else if (buildPrompts[i].elements[j].action != null) {
                    roundedRect(buildPrompts[i].posx + 10, 5 + buildPrompts[i].posy + (j + 1) * 25, buildPrompts[i].width - 20, 20, 8, 100, 100, 100);
                    drawText(buildPrompts[i].elements[j].text, buildPrompts[i].posx + 20, 20 + buildPrompts[i].posy + (j + 1) * 25, 255, 255, 255);
                }
            }
        }
    }
}

function mouseClick() {
    if (renderMode == "Build") {
        if (buildType == "bulldoze") {
            if (blocks[screenToWorld(pointerY)][screenToWorld(pointerX)].state >= 6) {
                farmMoney += props[blocks[screenToWorld(pointerY)][screenToWorld(pointerX)].state - 7].price * 0.5;
                blocks[screenToWorld(pointerY)][screenToWorld(pointerX)] = new tile(0, false, null, null, null);
                for (var i = 0; i < specialLocations.length; i++) {
                    if (specialLocations[i] != null) {
                        if (specialLocations[i].posx == screenToWorld(pointerX) && specialLocations[i].posy == screenToWorld(pointerY)) {
                            specialLocations[i] = null;
                        }
                    }
                }
            }
        } else if (farmMoney >= props[buildType - 7].price) {
            if (blocks[screenToWorld(pointerY)][screenToWorld(pointerX)].state <= 6) {
                blocks[screenToWorld(pointerY)][screenToWorld(pointerX)] = new tile(buildType, false, null, null, null);
                specialLocations[specialLocations.length] = new specialLocation(screenToWorld(pointerX), screenToWorld(pointerY), null);
                farmMoney -= props[buildType - 7].price;
            }
        } else {
            buildPrompts[buildPrompts.length] = new prompt(50, 225, 412, 60, [new element("Not Enough Money", null)]);
        }

        for (var i = 0; i < buildPrompts.length; i++) {
            if (buildPrompts[i] != null) {
                for (var j = 0; j < buildPrompts[i].elements.length; j++) {
                    if (pointerX > buildPrompts[i].posx + 10 && pointerX < buildPrompts[i].posx + buildPrompts[i].width - 20) {
                        // within element horizontally
                        if (pointerY > 10 + buildPrompts[i].posy + (j + 1) * 25 && pointerY < 30 + buildPrompts[i].posy + (j + 1) * 25) {
                            // within element vertically

                            if (buildPrompts[i].elements[j].action != null) {
                                // button pressed
                                eval(`${buildPrompts[i].elements[j].action}`);
                            }
                        }
                    }
                }
                if (pointerX >= buildPrompts[i].posx + 10 && pointerX <= buildPrompts[i].posx + 40 && pointerY >= buildPrompts[i].posy + 10 && pointerY <= buildPrompts[i].posy + 30) {
                    buildPrompts[i] = null;
                }
            }
        }
        renderMap();
    }
    if (renderMode != "Build") {
        for (var i = 0; i < normalPrompts.length; i++) {
            if (normalPrompts[i] != null) {
                for (var j = 0; j < normalPrompts[i].elements.length; j++) {
                    if (pointerX > normalPrompts[i].posx + 10 && pointerX < normalPrompts[i].posx + normalPrompts[i].width - 20) {
                        // within element horizontally
                        if (pointerY > 10 + normalPrompts[i].posy + (j + 1) * 25 && pointerY < 30 + normalPrompts[i].posy + (j + 1) * 25) {
                            // within element vertically

                            if (normalPrompts[i].elements[j].action != null) {
                                // button pressed
                                eval(`${normalPrompts[i].elements[j].action}`);
                            }
                        }
                    }
                }
                if (pointerX >= normalPrompts[i].posx + 10 && pointerX <= normalPrompts[i].posx + 40 && pointerY >= normalPrompts[i].posy + 10 && pointerY <= normalPrompts[i].posy + 30) {
                    normalPrompts[i] = null;
                    renderMap();
                }
            }
        }
    }
}

function buyGrain(amount) {
    if (vehicles[activeVehicle].implementAttached) {
        if (implements[vehicles[activeVehicle].attachedImplement].name == "Planter") {
            if (farmMoney >= calculateGrainCost(amount)) {
                if (implements[vehicles[activeVehicle].attachedImplement].inventory == null) {
                    implements[vehicles[activeVehicle].attachedImplement].inventory = new item("Grain", 0);
                }
                implements[vehicles[activeVehicle].attachedImplement].inventory.amount += amount;

                farmMoney -= calculateGrainCost(amount);
                normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element(`${amount} units of grain successfully bought, $${calculateGrainCost(amount)} spent`, null)]);
            } else {
                normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("Not Enough Money", null)]);
            }
        } else {
            normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("Planter Not Attached", null)]);
        }
    } else {
        normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("No Tool Attached", null)]);
    }
}

function buyFertilizer(amount) {
    if (vehicles[activeVehicle].implementAttached) {
        if (implements[vehicles[activeVehicle].attachedImplement].name == "Spreader") {
            if (farmMoney >= calculateFertilizerCost(amount)) {
                if (implements[vehicles[activeVehicle].attachedImplement].inventory == null) {
                    implements[vehicles[activeVehicle].attachedImplement].inventory = new item("Fertilizer", 0);
                }
                implements[vehicles[activeVehicle].attachedImplement].inventory.amount += amount;

                farmMoney -= calculateFertilizerCost(amount);
                normalPrompts[normalPrompts.length] = new prompt(50, 350, 412, 60, [new element(`${amount} units of fertilizer successfully bought, $${calculateFertilizerCost(amount)} spent`, null)]);
            } else {
                normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("Not Enough Money", null)]);
            }
        } else {
            normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("Spreader Not Attached", null)]);
        }
    } else {
        normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("No Tool Attached", null)]);
    }
}

function moveVehicle(f) {
    if (f) {
        if (
            vehicles[activeVehicle].posx - Math.round(Math.sin(toRadian(vehicles[activeVehicle].rotation))) >= 0 &&
            vehicles[activeVehicle].posx - Math.round(Math.sin(toRadian(vehicles[activeVehicle].rotation))) < mapSize &&
            vehicles[activeVehicle].posy + Math.round(Math.cos(toRadian(vehicles[activeVehicle].rotation))) >= 0 &&
            vehicles[activeVehicle].posy + Math.round(Math.cos(toRadian(vehicles[activeVehicle].rotation))) < mapSize
        ) {
            vehicles[activeVehicle].posy += Math.round(Math.cos(toRadian(vehicles[activeVehicle].rotation)));
            vehicles[activeVehicle].posx -= Math.round(Math.sin(toRadian(vehicles[activeVehicle].rotation)));
        }
    } else {
        vehicles[activeVehicle].posy -= Math.round(Math.cos(toRadian(vehicles[activeVehicle].rotation)));
        vehicles[activeVehicle].posx += Math.round(Math.sin(toRadian(vehicles[activeVehicle].rotation)));
    }
}

function moveImplement(f) {
    if (f) {
        implements[vehicles[activeVehicle].attachedImplement].posx = vehicles[activeVehicle].posx;
        implements[vehicles[activeVehicle].attachedImplement].posy = vehicles[activeVehicle].posy;
        implements[vehicles[activeVehicle].attachedImplement].rot = vehicles[activeVehicle].rotation;
    } else {
        implements[vehicles[activeVehicle].attachedImplement].posx += Math.round(Math.sin(toRadian(vehicles[activeVehicle].rotation)));
        implements[vehicles[activeVehicle].attachedImplement].posy -= Math.round(Math.cos(toRadian(vehicles[activeVehicle].rotation)));
        implements[vehicles[activeVehicle].attachedImplement].rot = vehicles[activeVehicle].rotation;
    }
}

function input(key) {
    switch (key) {
        case "x":
            screenshot();
            break;
        case "w":
            if (vehicles[activeVehicle].aoX == 0) {
                moveVehicle(true);
            }
            if (vehicles[activeVehicle].implementAttached) {
                moveImplement(true);
            }

            if (vehicles[activeVehicle].aoX != 0) {
                moveVehicle(true);
            }
            adjustChunk();
            break;
        case "s":
            moveVehicle(false);
            if (vehicles[activeVehicle].implementAttached) {
                moveImplement(false);
            }
            adjustChunk();
            break;
        case "d":
            if (vehicles[activeVehicle].aoX == 0) {
                if (vehicles[activeVehicle].rotation + 45 == 225) {
                    vehicles[activeVehicle].rotation = -135;
                } else {
                    vehicles[activeVehicle].rotation += 45;
                }
            }
            if (vehicles[activeVehicle].implementAttached) {
                implements[vehicles[activeVehicle].attachedImplement].rot = vehicles[activeVehicle].rotation;
            }
            if (vehicles[activeVehicle].aoX != 0) {
                if (vehicles[activeVehicle].rotation + 45 == 225) {
                    vehicles[activeVehicle].rotation = -135;
                } else {
                    vehicles[activeVehicle].rotation += 45;
                }
            }
            adjustChunk();
            break;
        case "a":
            if (vehicles[activeVehicle].aoX == 0) {
                if (vehicles[activeVehicle].rotation - 45 == -225) {
                    vehicles[activeVehicle].rotation = 135;
                } else {
                    if (vehicles[activeVehicle].rotation - 45 == -180) {
                        vehicles[activeVehicle].rotation = 180;
                    } else {
                        vehicles[activeVehicle].rotation -= 45;
                    }
                }
            }
            if (vehicles[activeVehicle].implementAttached) {
                implements[vehicles[activeVehicle].attachedImplement].rot = vehicles[activeVehicle].rotation;
            }
            if (vehicles[activeVehicle].aoX != 0) {
                if (vehicles[activeVehicle].rotation - 45 == -225) {
                    vehicles[activeVehicle].rotation = 135;
                } else {
                    if (vehicles[activeVehicle].rotation - 45 == -180) {
                        vehicles[activeVehicle].rotation = 180;
                    } else {
                        vehicles[activeVehicle].rotation -= 45;
                    }
                }
            }
            adjustChunk();
            break;
        case "v":
            if (vehicles[activeVehicle].implementAttached) {
                if (implements[vehicles[activeVehicle].attachedImplement].active) {
                    implements[vehicles[activeVehicle].attachedImplement].active = false;
                } else {
                    implements[vehicles[activeVehicle].attachedImplement].active = true;
                }
            }
            break;
        case "q":
            if (vehicles[activeVehicle].implementAttached) {
                vehicles[activeVehicle].implementAttached = false;
            } else {
                for (var i = 0; i < implements.length; i++) {
                    if (implements[i].toolType == vehicles[activeVehicle].name) {
                        if (implements[i].posy == vehicles[activeVehicle].posy) {
                            if (implements[i].rot == 90 && vehicles[activeVehicle].rotation == 90 && implements[i].posx - vehicles[activeVehicle].posx == -vehicles[activeVehicle].aoX) {
                                vehicles[activeVehicle].implementAttached = true;
                                vehicles[activeVehicle].attachedImplement = i;
                            } else if (implements[i].rot == -90 && vehicles[activeVehicle].rotation == -90 && implements[i].posx - vehicles[activeVehicle].posx == vehicles[activeVehicle].aoX) {
                                vehicles[activeVehicle].implementAttached = true;
                                vehicles[activeVehicle].attachedImplement = i;
                            }
                        } else if (implements[i].posx == vehicles[activeVehicle].posx) {
                            if (implements[i].rot == 0 && vehicles[activeVehicle].rotation == 0 && implements[i].posy - vehicles[activeVehicle].posy == vehicles[activeVehicle].aoY) {
                                vehicles[activeVehicle].implementAttached = true;
                                vehicles[activeVehicle].attachedImplement = i;
                            } else if (implements[i].rot == 180 && vehicles[activeVehicle].rotation == 180 && implements[i].posy - vehicles[activeVehicle].posy == -vehicles[activeVehicle].aoY) {
                                vehicles[activeVehicle].implementAttached = true;
                                vehicles[activeVehicle].attachedImplement = i;
                            }
                        } else if (
                            distanceBetweenPoints(implements[i].posx, implements[i].posy, vehicles[activeVehicle].posx, vehicles[activeVehicle].posy) <= 1.5 ||
                            distanceBetweenPoints(implements[i].posx, implements[i].posy, vehicles[activeVehicle].posx, vehicles[activeVehicle].posy) <= -1.5
                        ) {
                            vehicles[activeVehicle].implementAttached = true;
                            vehicles[activeVehicle].attachedImplement = i;
                        }
                    }
                }
            }
            break;
        case "e":
            if (activeVehicle < vehicles.length - 1) {
                activeVehicle++;
            } else {
                activeVehicle = 0;
            }
            break;
        case "l":
            for (var y = 0; y < blocks.length; y++) {
                for (var x = 0; x < blocks[y].length; x++) {
                    if (blocks[y][x].willGrow) {
                        if (blocks[y][x].state + 1 < 6) {
                            blocks[y][x].tillGrown -= 1;
                            blocks[y][x].state += 1;
                        }
                    }
                }
            }
            renderMap();
            break;
        case "r":
            if (vehicles[activeVehicle].name == "Harvester") {
                if (implements[4].rot == vehicles[activeVehicle].rotation) {
                    // same rotation
                    if (implements[4].posy - vehicles[activeVehicle].posy == 1 || implements[4].posy - vehicles[activeVehicle].posy == -1) {
                        if (implements[4].posx - vehicles[activeVehicle].posx == 0) {
                            if (vehicles[activeVehicle].rotation == 90 || vehicles[activeVehicle].rotation == -90) {
                                implements[4].inventory.amount += vehicles[activeVehicle].inventory.amount;
                                vehicles[activeVehicle].inventory.amount = 0;
                            }
                        }
                    } else if (implements[4].posx - vehicles[activeVehicle].posx == 1 || implements[4].posx - vehicles[activeVehicle].posx == -1) {
                        if (implements[4].posy - vehicles[activeVehicle].posy == 0) {
                            if (vehicles[activeVehicle].rotation == 0 || vehicles[activeVehicle].rotation == 180) {
                                implements[4].inventory.amount += vehicles[activeVehicle].inventory.amount;
                                vehicles[activeVehicle].inventory.amount = 0;
                            }
                        }
                    }
                }
            }
            if (implements[vehicles[activeVehicle].attachedImplement].name == "Grain Trailer") {
                for (var i = 0; i < specialLocations.length; i++) {
                    if (
                        implements[vehicles[activeVehicle].attachedImplement].posx == specialLocations[i].posx &&
                        implements[vehicles[activeVehicle].attachedImplement].posy == specialLocations[i].posy &&
                        blocks[implements[vehicles[activeVehicle].attachedImplement].posy][implements[vehicles[activeVehicle].attachedImplement].posx].state == 7
                    ) {
                        farmMoney += 3 * calculateGrainCost(implements[vehicles[activeVehicle].attachedImplement].inventory.amount);
                        implements[vehicles[activeVehicle].attachedImplement].inventory.amount = 0;
                    }
                }
            }
            break;
        case "n":
            normalPrompts[normalPrompts.length] = new prompt(50, 50, 412, 285, [
                new element("Buy Grain", null),
                new element(`Buy 10 Units Of Grain For $${calculateGrainCost(10)}`, "buyGrain(10)"),
                new element(`Buy 100 Units Of Grain For $${calculateGrainCost(100)}`, "buyGrain(100)"),
                new element(`Buy 500 Units Of Grain For $${calculateGrainCost(500)}`, "buyGrain(500)"),
                new element(`Buy 1000 Units Of Grain For $${calculateGrainCost(1000)}`, "buyGrain(1000)"),
                new element("Buy Fertilizer", null),
                new element(`Buy 10 Units Of Fertilizer For $${calculateFertilizerCost(10)}`, "buyFertilizer(10)"),
                new element(`Buy 100 Units Of Fertilizer For $${calculateFertilizerCost(100)}`, "buyFertilizer(100)"),
                new element(`Buy 500 Units Of Fertilizer For $${calculateFertilizerCost(500)}`, "buyFertilizer(500)"),
                new element(`Buy 1000 Units Of Fertilizer For $${calculateFertilizerCost(1000)}`, "buyFertilizer(1000)"),
            ]);
            break;
        case "b":
            normalPrompts[normalPrompts.length] = new prompt(50, 50, 412, 285, [new element("Huber Ag Ltd.", null)]);
            for (var i = 0; i < purchaseableEquipment.length; i++) {
                var text = `Buy ${purchaseableEquipment[i].size} ${purchaseableEquipment[i].name} for $${purchaseableEquipment[i].price}`;
                normalPrompts[normalPrompts.length - 1].elements[i + 1] = new element(text, `buyEquipment(purchaseableEquipment[${i}])`);
            }
            break;
        case "p":
            renderMap();
            if (renderMode == "Normal") {
                for (var i = 0; i < vehicles.length; i++) {
                    if (vehicles[i].posx < 0 || vehicles[i].posx > mapSize || vehicles[i].posy < 0 || vehicles[i].posx > mapSize) {
                        vehicles[i].posx = mapSize / 2;
                        vehicles[i].posy = mapSize / 2;
                    }
                }
                for (var i = 0; i < implements.length; i++) {
                    if (implements[i].posx < 0 || implements[i].posx > mapSize || implements[i].posy < 0 || implements[i].posx > mapSize) {
                        implements[i].posx = canvasSize / 2;
                        implements[i].posy = canvasSize / 2;
                    }
                }
            }
            break;
        case "c":
            showControls();
            break;
        case "m":
            if (renderMode == "Build") {
                renderMode = "Normal";
            } else {
                renderMode = "Build";
                buildPrompts[buildPrompts.length] = new prompt(50, 412, 412, 60, [new element("1. SellPoint | 2. Fence 1 | 3. Fence 2 | 4. Fence 3", null)]);
            }
            renderMap();
            break;
        case "k":
            saveVariableToFile(implements, "implements");
            saveVariableToFile(vehicles, "vehicles");
            saveVariableToFile(blocks, "map");
            break;
        case "1":
            targetFps = 15;
            break;
        case "2":
            targetFps = 30;
            break;
        case "3":
            targetFps = 60;
            break;
        case "4":
            targetFps = 120;
            break;
        case "5":
            targetFps = 1000;
            break;
        case "0":
            if (debugOn) {
                debugOn = false;
            } else {
                debugOn = true;
            }
    }

    if (renderMode == "Build") {
        if (key % 1 == 0) {
            if (parseInt(key) + 6 < tileImages.length) {
                buildType = parseInt(key) + 6;
                renderPortionOfMap(screenToWorld(pointerX) - 3, screenToWorld(pointerY) - 3, screenToWorld(pointerX) + 3, screenToWorld(pointerY) + 3);
                paintImage(tileImages[buildType], screenToWorld(pointerX) * spriteSize, screenToWorld(pointerY) * spriteSize, 0);
            }
        }
        if (key == "b") {
            buildType = "bulldoze";
        }
    }
}

function debugMenu() {
    drawRect(15, 25, 35, 45, 0, 0, 0);
    drawText(frame, 20, 40, 255, 255, 255);
    drawText(Math.round(actualFps), 20, 60);
}

function saveVariableToFile(variable, saveName) {
    var thingToSave = JSON.stringify(variable);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:attachment/text," + encodeURI(thingToSave);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${saveName}.json`;
    hiddenElement.click();
}

function buyEquipment(machine) {
    if (farmMoney >= machine.price) {
        if (machine.type == "vehicle") {
            if (machine.name == "Tractor") {
                vehicles[vehicles.length] = new vehicle(30, 3, -90, null, null, 100, machine.name, 1, 1, null, machine);
                farmMoney -= machine.price;
            } else if (machine.name == "Harvester") {
                vehicles[vehicles.length] = new vehicle(30, 3, -90, null, null, 100, machine.name, 0, 0, new item("Grain", 0), machine);
                farmMoney -= machine.price;
            }
        } else if (machine.type == "implement") {
            var functionOfTool;
            switch (machine.name) {
                case "Disc Harrow":
                    functionOfTool = machineFunctions[0];
                    break;
                case "Planter":
                    functionOfTool = machineFunctions[1];
                    break;
                case "Header":
                    functionOfTool = machineFunctions[2];
                    break;
                case "Spreader":
                    functionOfTool = machineFunctions[3];
                    break;
            }
            if (machine.size == "Small") {
                implements[implements.length] = new implement(30, 3, -90, null, machine.name, machine.attachableTo, 0, 0, null, machine, functionOfTool);
                farmMoney -= machine.price;
            } else if (machine.size == "Large") {
                implements[implements.length] = new implement(30, 3, -90, null, machine.name, machine.attachableTo, 1, 0, null, machine, functionOfTool);
                farmMoney -= machine.price;
            }
        }
    } else {
        normalPrompts[normalPrompts.length] = new prompt(50, 225, 412, 60, [new element("Not Enough Money", null)]);
    }
    if (vehicles[0] != null) {
        renderMode = "Normal";
    }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function renderMap() {
    for (var y = chunkY * canvasSize; y < (chunkY + 1) * canvasSize; y++) {
        for (var x = chunkX * canvasSize; x < (chunkX + 1) * canvasSize; x++) {
            paintImage(tileImages[blocks[y][x].state], x * spriteSize - chunkX * spriteSize * canvasSize, y * spriteSize - chunkY * spriteSize * canvasSize, 0);
        }
    }
}

function renderPortionOfMap(aX, aY, bX, bY) {
    for (var y = aY; y < bY; y++) {
        for (var x = aX; x < bX; x++) {
            if (y >= 0 && x >= 0) {
                if (blocks[y][x] != null) {
                    paintImage(tileImages[blocks[y][x].state], x * spriteSize, y * spriteSize, 0);
                }
            }
        }
    }
}

function updateMap() {
    for (var i = 0; i < implements.length; i++) {
        for (var y = -2; y <= 2; y++) {
            for (var x = -2; x <= 2; x++) {
                if (implements[i].posx + x >= 0 && implements[i].posx + x <= mapSize && implements[i].posy + y >= 0 && implements[i].posy + y <= mapSize) {
                    paintImage(
                        tileImages[blocks[implements[i].posy + y][implements[i].posx + x].state],
                        (implements[i].posx + x) * spriteSize - chunkX * spriteSize * canvasSize,
                        (implements[i].posy + y) * spriteSize - chunkY * spriteSize * canvasSize,
                        0
                    );
                }
            }
        }
    }
    for (var i = 0; i < vehicles.length; i++) {
        for (var y = -2; y <= 2; y++) {
            for (var x = -2; x <= 2; x++) {
                if (vehicles[i].posx + x >= 0 && vehicles[i].posx + x <= mapSize && vehicles[i].posy + y >= 0 && vehicles[i].posy + y <= mapSize) {
                    paintImage(
                        tileImages[blocks[vehicles[i].posy + y][vehicles[i].posx + x].state],
                        (vehicles[i].posx + x) * spriteSize - chunkX * spriteSize * canvasSize,
                        (vehicles[i].posy + y) * spriteSize - chunkY * spriteSize * canvasSize,
                        0
                    );
                }
            }
        }
    }
}

function paintImage(image, x, y, angle) {
    painter.save();
    painter.translate(x, y);
    painter.rotate(toRadian(180 + angle));
    painter.drawImage(image, -1 * (spriteSize / 2), -1 * (spriteSize / 2));
    painter.restore();
}

function toRadian(angle) {
    return (180 + angle) * (Math.PI / 180);
}

function clearScreen() {
    painter.clearRect(0, 0, width, height);
}

function findSlope(y2, y1, x2, x1) {
    return ((y2 - y1) / (x2 - x1)) * -1;
}

function drawRect(x1, y1, x2, y2, r, g, b) {
    painter.beginPath();
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.rect(x1, y1, x2, y2);
    painter.stroke();
    painter.fill();
    painter.closePath();
}

function roundedRect(x, y, width, height, radius, r, g, b) {
    painter.beginPath();
    painter.moveTo(x, y + radius);
    painter.arcTo(x, y + height, x + radius, y + height, radius);
    painter.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    painter.arcTo(x + width, y, x + width - radius, y, radius);
    painter.arcTo(x, y, x, y + radius, radius);
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.stroke();
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fill();
    painter.closePath();
}

function drawText(text, x, y, r, g, b) {
    painter.beginPath();
    painter.font = "15px Arial";
    painter.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.fillText(text, x, y + 1);
    painter.closePath();
}

function drawCircle(sX, sY, hStretch, vStretch, rotation, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    painter.ellipse(sX, sY, hStretch, vStretch, rotation, 0, 360);
    painter.stroke();
    painter.fill();
    painter.closePath();
}

function drawLine(sX, sY, eX, eY, r, g, b) {
    painter.beginPath();
    painter.strokeStyle = `rgb(${r},${g},${b})`;
    painter.moveTo(sX, sY);
    painter.lineTo(eX, eY);
    painter.closePath();
    painter.stroke();
}

document.addEventListener(
    "keydown",
    (event) => {
        var name = event.key;
        input(name);
    },
    false
);

document.onmousemove = function (event) {
    const target = event.target;
    const rect = target.getBoundingClientRect();
    var wRatio = (rect.right - rect.left) / width;
    var hRatio = (rect.bottom - rect.top) / height;
    pointerX = (event.pageX - window.scrollX - rect.left) / wRatio;
    pointerY = (event.pageY - window.scrollY - rect.top) / hRatio;

    if (renderMode == "Build") {
        if (buildType >= 6) {
            renderPortionOfMap(screenToWorld(pointerX) - 3, screenToWorld(pointerY) - 3, screenToWorld(pointerX) + 3, screenToWorld(pointerY) + 3);
            paintImage(tileImages[buildType], screenToWorld(pointerX) * spriteSize, screenToWorld(pointerY) * spriteSize, 0);
        } else if (buildType == "bulldoze") {
            renderPortionOfMap(screenToWorld(pointerX) - 3, screenToWorld(pointerY) - 3, screenToWorld(pointerX) + 3, screenToWorld(pointerY) + 3);
            paintImage(icons[0], screenToWorld(pointerX) * spriteSize, screenToWorld(pointerY) * spriteSize, 0);
        }
    }
};

setup();
setInterval(update, 1 / targetFps);
