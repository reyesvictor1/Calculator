const calculator = document.querySelector("#calculator");
const buttonsTop = document.querySelector("#buttons-top");
const buttonsBottom = document.querySelector("#buttons-bottom");
const screenTop = document.querySelector("#screen-top");
const screenBottom = document.querySelector("#screen-bottom");

let stringTop = "";
let stringBottom = "0";
let operandTyped = false;
let operand = "";
let waitingForB = false;
let A;
let B;

const buttonLabelsTop = ["CLEAR", "DELETE"];
const buttonLabelsBottom = ["7", "8", "9", "/",
                            "4", "5", "6", "x",
                            "1", "2", "3", "-",
                            "0", ".", "=", "+"];

screenBottom.textContent = stringBottom;
arrangeButtons(buttonLabelsTop, buttonsTop, 2);
arrangeButtons(buttonLabelsBottom, buttonsBottom, 4);


//============================= functions =============================

function arrangeButtons(buttonLabels, section, columns) {

    buttonLabels.forEach((button) => {
        const btn = document.createElement("button");
        btn.textContent = `${button}`;
        btn.style.margin = "5px";
        btn.setAttribute("id", `btn-${button}`);
        btn.addEventListener("click", enterValue);
        section.appendChild(btn);
    });

    const rows = Math.trunc(buttonLabels.length / columns);
    section.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; // create n columns
    section.style.gridTemplateRows = `repeat(${rows}, 1fr)`; // create n rows
}

function enterValue(callback) {
    const selectedKey = callback.target.textContent;
    switch (selectedKey) {
        case "CLEAR":
            clear();
            break;
        case "DELETE":
            stringBottom = stringBottom.slice(0, -1);
            break;
        case "/":
        case "x":
        case "-":
        case "+":
            operand = `${selectedKey}`;
            if (stringBottom === "") break;
            if (A == undefined) A = parseFloat(stringBottom);           
            stringTop = `${A} ${operand} `;
            operandTyped = true;          
            break;
        case ".":
            if (!hasPeriodAlready())
            stringBottom += selectedKey;
            break;
        case "=":
            if (stringBottom === "") break;
            if (waitingForB || operand == "") break;
            if (A == undefined && B == undefined) break;
            if (A != undefined && B == undefined) B = parseFloat(stringBottom);
            stringTop = `${A} ${operand} ${B} =`;
            if (operand === "/" && B == 0) {
                alert("MATH ERROR: You can't divide by 0");
                return;
            } else {
                A = compute();
                stringBottom = `${A}`;
                operand = ""; 
            }
            B = null;  
            waitingForB = true;
            break;
        default: // any digit
            if (waitingForB) waitingForB = false;
            if (stringBottom == 0) stringBottom = "";
            if (operandTyped) {
                stringBottom = selectedKey;
                operandTyped = false;
            } else {
                if (stringBottom.length < 11) stringBottom += selectedKey;
            }
            break;
    }

    // update calculator screen
    screenTop.textContent = stringTop;
    screenBottom.textContent = stringBottom;
}

function compute() {
    switch (operand) {
        case "+":
            return formatNum(A + B);
        case "-":
            return formatNum(A - B);
        case "x":
            return formatNum(A * B);
        case "/":
            return formatNum(A / B);   
        default:
            break;
    }
}

function formatNum(num) {
    let str = num.toString();
    if (/\.\d{4,}/.test(str)) return parseFloat(num).toFixed(3);
    return num;
}

function hasPeriodAlready() {
    const arr = stringBottom.split(".");
    console.log(arr);
    if (arr.length > 1) return true;
    return false;
}

function clear() {
    A = null;
    B = null;
    stringTop = "";
    stringBottom = "0";
    screenTop.textContent = stringTop;
    screenBottom.textContent = stringBottom;
}