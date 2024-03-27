const log = require("./utilities/DebugLog");
const fs = require('fs');
const PNG = require('pngjs').PNG;

let canvas = [];
let canvasSize = 1000;
let iterations = 100000000;

let animIndex = 0;
let anim = true;

let instructionSet = "RRRRRRLLLLLLL";

//init mode
let mode = [];
for (let i of instructionSet)
{
    mode.push({color: randColor(), instruction: String(i) })
}

let antX = Math.floor(canvasSize / 2);
let antY = antX;
let antFacing = 0;

initCanvas(canvasSize);

function initCanvas(size)
{
    for(let i = 0; i < size; i++)
    {
        let row = [];
        for(let j = 0; j < size; j++)
        {
            row.push(0);
        }
        canvas.push(row);
    }
}

function step()
{
    //phase 1: walk forward
    switch (antFacing)
    {
        case 0://north
            antY--;
        break;
        case 1://east
            antX++;
        break;
        case 2://south
            antY++;
        break;
        case 3://west
            antX--;
        break;
    }

    //phase 2: bounce
    if(antX >= canvasSize)
    {
        antX = 0;
    }
    if(antY >= canvasSize)
    {
        antY = 0;
    }

    if(antX < 0)
    {
        antX = canvasSize - 1;
    }
    if(antY < 0)
    {
        antY = canvasSize - 1;
    }

    //phase 3: turn
    let c = canvas[antX][antY];

    if(mode[c].instruction == "R")
        antFacing++;
    if(mode[c].instruction == "L")
        antFacing--;

    //phase 3.5: fix turn
    if(antFacing > 3)
        antFacing = 0;
    if(antFacing < 0)
        antFacing = 3;

    //phase 4: advance color
    c = ++c % mode.length;

    canvas[antX][antY] = c;
}

function randColor()
{
    return `${Math.floor(Math.random() * 255)}-${Math.floor(Math.random() * 255)}-${Math.floor(Math.random() * 255)}`;
}

for(let i = 0; i <= iterations; i++)
{
    if(i % (iterations * 0.0015) == 0)
    {
        log(`On step: ${i}`);
        if(anim && i != 0)
        {
            renderCanvas();
            animIndex++;
        }
    }
    step();
}

function renderCanvas()
{
    let render = new PNG({width:canvasSize, height:canvasSize});

    for(let x = 0; x < canvasSize; x++)
    {
        for(let y = 0; y < canvasSize; y++)
        {
            const index = (canvasSize * x + y) * 4;

            const rgb = mode[canvas[x][y]].color.split('-');

            render.data[index] = rgb[0];
            render.data[index + 1] = rgb[1];
            render.data[index + 2] = rgb[2];
            render.data[index + 3] = 255;
        }
    }
    const index = (canvasSize * antX + antY) * 4;
    render.data[index] = render.data[index + 3] = 255; //red and alpha
    render.data[index + 1] = render.data[index + 2] = 0; //blue and green

    if(anim)
        render.pack().pipe(fs.createWriteStream(`output/${animIndex}.png`)).on('finish', () => {log("PNG saved.")});
    else
        render.pack().pipe(fs.createWriteStream(`output/output.png`)).on('finish', () => {log("PNG saved.")});
}

renderCanvas()
log(`Finished. Ant is at: X${antY}, Y${antX}`);