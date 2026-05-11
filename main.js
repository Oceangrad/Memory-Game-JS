const FIELD = document.getElementById("field");
const CONFIG = {
    fieldSize: {
        x: 3,
        y: 2
    },
    cellSize: {
        x: "65px",
        y: "90px"
    },
    closedCellColor: "black",
    timeout: 500,
    selectedCellBorderStyle: "3px red solid", // Style that applies to cell's border when its selected
    defaultCellBorderStyle: "3px black solid", // Default cell's border style
    defaultCellBorderRadius: "10px"
};

init();

let cells = FIELD.getElementsByTagName("td");
let colors = fillColorArray();

let first = true;

let canOpen = true;

let elem1 = null;
let elem2 = null;

let closedElems = [];

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() { open(i); });
}

//----------------------------------GAME INITIALIZING-------------------------

function init() {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    
    td.style.width = CONFIG.cellSize.x;
    td.style.height = CONFIG.cellSize.y;
    td.style.backgroundColor = CONFIG.closedCellColor;
    td.style.borderRadius = CONFIG.defaultCellBorderRadius;
    td.style.border = CONFIG.defaultCellBorderStyle;

    for (let i = 0; i < CONFIG.fieldSize.x; i++) {
        tr.innerHTML += td.outerHTML;
    }

    for (let i = 0; i < CONFIG.fieldSize.y; i++) {
        FIELD.innerHTML += tr.outerHTML;
    }
}

function fillColorArray() {
    let colors = [];
    let even = CONFIG.fieldSize.x*CONFIG.fieldSize.y % 2;
    if (even !== 0) throw new Error("Number of cell should be even.");

    for (let i = 0; i < (CONFIG.fieldSize.x*CONFIG.fieldSize.y)/2; i++) {
        let color = getRandColor();
        colors.push(color, color);
    }
    shuffle(colors);
    return colors;
}

function getRandColor() {
    let color = {
        r: getRandNum(0, 255),
        g: getRandNum(0, 255),
        b: getRandNum(0, 255)
    }

    color.toCSS = () => { return "rgb("+color.r+","+color.g+","+color.b+")"; };
    color.equal = (value) => {
        return color.r==value.r && color.g==value.g && color.b==value.b;
    }

    return color;
}

function getRandNum(start, end) {
    let num = (Math.random()*(end-start))+start;
    num = Math.round(num);
    return num;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

//-------------------------------------------------GAME PROCESS-------------------------------------------------

function open(i) {
    let cell = cells[i];

    if (closedElems.findIndex((val) => val == i) !== -1 || !canOpen) return;

    if (first) {
        cell.style.backgroundColor = colors[i].toCSS();
        cell.style.border = CONFIG.selectedCellBorderStyle;
        elem1 = i;
    }
    else {
        if (elem1 == i) {
            return;
        }

        cell.style.backgroundColor = colors[i].toCSS();
        cell.style.border = CONFIG.selectedCellBorderStyle;
        elem2 = i;

        let color1 = colors[elem1];
        let color2 = colors[elem2];

        let cell1 = cells[elem1];
        let cell2 = cells[elem2];

        canOpen = false;
        setTimeout(() => {
            if (color1.equal(color2)) {
                closedElems.push(elem1, elem2);
                if (closedElems.length == cells.length) {
                    console.log("win");
                }
            } else {
                cell1.style.backgroundColor = CONFIG.closedCellColor;
                cell2.style.backgroundColor = CONFIG.closedCellColor;
            }
            cell1.style.border = CONFIG.defaultCellBorderStyle;
            cell2.style.border = CONFIG.defaultCellBorderStyle;
            canOpen = true;
        }, CONFIG.timeout);
    }

    first = !first;
}