var allowed = /^[a-zA-Z]+$/;
var rowArray = [];
var index;
var resultArray = [];
var oldResultArray = [];

function makeConstantTable(constant, fullFormula) {
    var truthTable = document.getElementById("truthTable");
    var head = truthTable.createTHead();
    var row = head.insertRow(0);

    for (var i = 0; i < constant.length; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = constant[i];
    }
    cell = row.insertCell(constant.length);
    cell.innerHTML = fullFormula.join(" ");

    printRow(Math.pow(2, constant.length), constant);
    var assignmentsArray = makeTableArray(constant);
    printTable(Math.pow(2, constant.length), constant, assignmentsArray);
}

function makeTableArray(constant) {
    var assignments = [];

    if (constant.length == 2) {
        assignments = ["F", "F", "F", "T", "T", "F", "T", "T"];
    } else if (constant.length == 3) {
        assignments = ["F", "F", "F", "F", "F", "T", "F", "T", "F", "F", "T", "T", "T", "F", "F", "T", "F", "T", "T", "T", "F", "T", "T", "T"];
    } else if (constant.length == 4) {
        assignments = ["F", "F", "F", "F", "F", "F", "F", "T", "F", "F", "T", "F", "F", "F", "T", "T", "F", "T", "F", "F", "F", "T", "F", "T", "F", "T", "T", "F", "F", "T", "T", "T", "T", "F", "F", "F", "T", "F", "F", "T", "T", "F", "T", "F", "T", "F", "T", "T", "T", "T", "F", "F", "T", "T", "F", "T", "T", "T", "T", "F", "T", "T", "T", "T"];
    } else {
        return;
    }

    return assignments;
}

function printRow(x, constant) {

    if (x == 0) {
        return;
    }

    var row = document.createElement("tr");
    for (var j = 0; j < (constant.length); j++) {
        for (var i = 0; i < 1; i++) {
            var cell = document.createElement("td");
            row.appendChild(cell);
        }
    }

    var lastcell = document.createElement("td");
    row.appendChild(lastcell);
    truthTable.appendChild(row);

    printRow(x - 1, constant);

}

function printTable(x, constant, value) {

    var j = 0;
    for (var k = 2; k < (x + 2); k++) {
        for (var l = 1; l < (constant.length + 1); l++) {
            document.querySelector("#truthTable > tr:nth-child(" + k + ") > td:nth-child( " + l + ")").innerHTML = value[j];
            j++;
        }
    }
}

function solve(formula, expression, constant) {
    console.log(formula);

    if (formula.length === 1) {
        console.log(formula);
        convertArray(oldResultArray);
        convertArray(resultArray);
        oldResultArray.push("-");
        oldResultArray = oldResultArray.concat(resultArray);
        solveArray(oldResultArray, formula[0], constant);
        return;
    }

    if (resultArray.length !== 0 && formula.length > 2) {
        oldResultArray = resultArray;
        resultArray = [];
    }

    rowArray = [];
    var j = 1;
    var x = Math.pow(2, constant.length);
    for (var i = 0; i < formula.length; i++) {
        if (allowed.test(formula[i])) {
            for (var k = 0; k < (constant.length);) {
                if (document.querySelector("#truthTable > thead > tr > td:nth-child(" + j + ")").innerText == formula[i]) {
                    getRow(j, constant);
                    j = 1;
                    break;
                } else {
                    j++;
                    k++;
                }
            }
        }
    }
    console.log(rowArray);
    convertArray(rowArray);
    console.log(rowArray);
    solveArray(rowArray, expression, constant);
    return;
}

function convertArray(rowArray) {
    for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i] == "T") {
            rowArray[i] = "1";
        } else if (rowArray[i] == "F") {
            rowArray[i] = "0";
        }
    }
}

function solveArray(rowArray, expression, constant) {

    if (expression == "^" && resultArray.length === 0) {
        getMin(rowArray);
        printResult(resultArray, constant);
        return;
    } else if (expression == "^" && resultArray.length !== 0) {
        convertArray(resultArray);
        resultArray.push("-");
        resultArray = resultArray.concat(rowArray);
        getMin(resultArray);
        printResult(resultArray, constant);
        return;
    }

    if (expression == "|" && resultArray.length === 0) {
        getMax(rowArray);
        printResult(resultArray, constant);
        return;
    } else if (expression == "|" && resultArray.length !== 0) {
        convertArray(resultArray);
        resultArray.push("-");
        resultArray = resultArray.concat(rowArray);
        getMax(resultArray);
        printResult(resultArray, constant);
        return;
    }

    if (expression == "↔" && resultArray.length === 0) {
        getBioConditional(rowArray);
        printResult(resultArray, constant);
        return;
    } else if (expression == "↔" && resultArray.length !== 0) {
        convertArray(resultArray);
        resultArray.push("-");
        resultArray = resultArray.concat(rowArray);
        getBioConditional(resultArray);
        printResult(resultArray, constant);
        return;
    }

    if (expression == ">" && resultArray.length === 0) {
        getConditional(rowArray);
        printResult(resultArray, constant);
        return;
    } else if (expression == ">" && resultArray.length !== 0) {
        convertArray(resultArray);
        resultArray.push("-");
        resultArray = resultArray.concat(rowArray);
        getConditional(resultArray);
        printResult(resultArray, constant);
        return;
    }

    if (expression == "⊕" && resultArray.length === 0) {
        getExclusive(rowArray);
        printResult(resultArray, constant);
        return;
    } else if (expression == "⊕" && resultArray.length !== 0) {
        convertArray(resultArray);
        resultArray.push("-");
        resultArray = resultArray.concat(rowArray);
        getExclusive(resultArray);
        printResult(resultArray, constant);
        return;
    }

}

function getRow(j, constant) {
    var x = Math.pow(2, constant.length);

    for (var k = 2; k < (x + 2); k++) {
        rowArray.push(document.querySelector("#truthTable > tr:nth-child(" + k + ") > td:nth-child( " + j + ")").innerText);
    }

    index = rowArray.indexOf("-");

    if (index == -1) {
        rowArray.push("-");
    }
}

function getMin(rowArray) {
    index = rowArray.indexOf("-")
    if (index !== -1) {
        secondRowArray = rowArray.splice(index, rowArray.length);
        secondRowArray = secondRowArray.splice(1);
    }
    for (let i = 0; i < rowArray.length; i++) {
        if (rowArray[i] !== "-") {
            result = Math.min(rowArray[i], secondRowArray[i]);
            if (result == 0) {
                rowArray[i] = "F"
            } else {
                rowArray[i] = "T"
            }
        } else {
            i++
            continue;
        }
    }

    resultArray = rowArray;

}

function getMax(rowArray) {
    index = rowArray.indexOf("-")
    if (index !== -1) {
        secondRowArray = rowArray.splice(index, rowArray.length);
        secondRowArray = secondRowArray.splice(1);
    }
    for (let i = 0; i < rowArray.length; i++) {
        if (rowArray[i] !== "-") {
            result = Math.max(rowArray[i], secondRowArray[i]);
            if (result == 0) {
                rowArray[i] = "F"
            } else {
                rowArray[i] = "T"
            }
        } else {
            i++
            continue;
        }
    }

    resultArray = rowArray;

}

function getBioConditional(rowArray) {
    index = rowArray.indexOf("-")
    if (index !== -1) {
        secondRowArray = rowArray.splice(index, rowArray.length);
        secondRowArray = secondRowArray.splice(1);
    }
    for (let i = 0; i < rowArray.length; i++) {
        if (rowArray[i] !== "-") {
            result = rowArray[i] === secondRowArray[i];
            if (result == true) {
                rowArray[i] = "T"
            } else {
                rowArray[i] = "F"
            }
        } else {
            i++
            continue;
        }
    }

    resultArray = rowArray;

}

function getConditional(rowArray) {
    index = rowArray.indexOf("-")
    if (index !== -1) {
        secondRowArray = rowArray.splice(index, rowArray.length);
        secondRowArray = secondRowArray.splice(1);
    }
    for (let i = 0; i < rowArray.length; i++) {
        if (rowArray[i] !== "-") {
            result = secondRowArray[i] <= rowArray[i];
            if (result == true) {
                rowArray[i] = "T"
            } else {
                rowArray[i] = "F"
            }
        } else {
            i++
            continue;
        }
    }

    resultArray = rowArray;

}

function getExclusive(rowArray) {
    index = rowArray.indexOf("-")
    if (index !== -1) {
        secondRowArray = rowArray.splice(index, rowArray.length);
        secondRowArray = secondRowArray.splice(1);
    }
    for (let i = 0; i < rowArray.length; i++) {
        if (rowArray[i] !== "-") {
            result = secondRowArray[i] !== rowArray[i];
            if (result == true) {
                rowArray[i] = "T"
            } else {
                rowArray[i] = "F"
            }
        } else {
            i++
            continue;
        }
    }

    resultArray = rowArray;

}



function printResult(resultArray, constant) {
    var l = 0;
    for (var k = 2; k < Math.pow(2, constant.length) + 2; k++) {
        document.querySelector("#truthTable > tr:nth-child(" + k + ") > td:nth-child( " + (constant.length + 1) + ")").innerHTML = resultArray[l];
        l++;
    }
}

function clearResult() {
    resultArray = [];
}