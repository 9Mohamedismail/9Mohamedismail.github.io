const formula = document.getElementById('Formula');
const Button = document.getElementById('button');

Button.addEventListener("click", parseInput);
const alertMessage = document.getElementById('alertMessage');
var newFormulaArray = [];
var constants;
var oldFormula;
var allowed = /^[a-zA-Z]+$/;
var oldResultArray;

function parseInput() {
    document.getElementById("truthTable").innerHTML = '';
    alertMessage.innerHTML = '';
    var formVal = [];

    var removeSpace = formula.value.split(" ").join("");

    let parsedFormula = removeSpace.toLowerCase();

    var allowedChars = /[A-Za-z|^()↔>⊕=→∧&∨≡]/;

    var i;

    for (i = 0; i < parsedFormula.length; i++) {
        if (!allowedChars.test(parsedFormula[i])) {
            var error = i;
            alertMessage.innerHTML = '';
            alertMessage.innerHTML = 'Illegal Character: ' + parsedFormula[error];
            return;
        } else {
            formVal.push(parsedFormula[i]);
        }
    }
    checkFormula(formVal);

    clearResult();
}

function checkFormula(formula) {
    var i = 0;
    var makedExpression;
    var index;
    var newFormula;
    var expressionAllowed = /[|^↔>⊕=→∧&∨≡]/;

    oldFormula = formula;

    constants = formula.filter(formula => formula.match(allowed));
    constants = removeDuplicates(constants);
    constants = constants.sort();

    formula = checkAndReplace(formula);

    if (!(formula.length > 2)) {
        alertMessage.innerHTML = '';
        alertMessage.innerHTML = 'Illegal Formula';
        return;
    }

    if (checkBrackets(formula) !== true) {
        alertMessage.innerHTML = '';
        alertMessage.innerHTML = 'Illegal Brackets';
        return;
    }

    if (expressionAllowed.test(formula[0])) {
        alertMessage.innerHTML = '';
        alertMessage.innerHTML = 'Illegal Expression Placement: ' + formula[0];
        return;
    }

    makeConstantTable(constants, oldFormula);

    for (var k = 0; k < formula.length + 1; k++) {
        if (formula[0] == "(" && !expressionAllowed.test(formula[1])) {
            index = formula.findIndex(formula => formula == ")");
            newFormula = formula.slice(i + 1, index);
            formula = formula.slice(index + 1, formula.length - 1);
            makedExpression = makeExpression(newFormula);
        } else if (expressionAllowed.test(formula[0]) && formula[1] == "(" && formula[0] === "^") {
            newFormula = formula.slice(0, 3);
            formula = formula.slice(3, formula.length);
            newFormula.splice(1, 1);
            if (formula.length === 1) {
                alertMessage.innerHTML = '';
                alertMessage.innerHTML = 'Illegal Formula: Fix it';
                document.getElementById("truthTable").innerHTML = '';
                return;
            } else if (newFormula[0] == "|") {
                newFormula = newFormula.concat(formula);
                makedExpression = makeExpression(newFormula);
                return;
            } else if (newFormula[0] == "^") {
                newFormula = newFormula.concat(formula);
                makedExpression = makeExpression(newFormula);
                return;
            } else {
                makedExpression = makeExpression(newFormula);
                return;
            }
        } else if (expressionAllowed.test(formula[1]) && formula[i] === "^") {
            newFormula = formula.slice(0, 3);
            formula = formula.slice(3, formula.length);
            makedExpression = makeExpression(newFormula);
            continue;
        } else {
            if (formula.includes(")")) {
                index = formula.findIndex(formula => formula == ")");
                formula.splice(index, index);
            }
            if (formula.includes("(")) {
                index = formula.findIndex(formula => formula == "(");
                if (index == 1) {
                    formula.splice(index, index);
                } else {
                    formula.splice(index, index - 1);
                }
            }
            makedExpression = makeExpression(formula);
            return;
        }
    }


    if (makedExpression === -999) {
        document.getElementById("truthTable").innerHTML = '';
        return;
    }
}


function makeExpression(formula) {

    if (formula.length < 3) {
        if (allowed.test(formula[0])) {
            alertMessage.innerHTML = '';
            alertMessage.innerHTML = 'Illegal Formula: Forgot Expression in middle';
            return -999;
        }
    }

    if ((formula.includes("|") || formula.includes("↔") || formula.includes(">") || formula.includes("⊕")) && formula.length === 3) {
        makeExpressionTwo(formula, constants);
    } else if ((formula.includes("|") || formula.includes("↔") || formula.includes(">") || formula.includes("⊕")) && formula.length !== 3) {
        makeExpressionTwo(formula, constants);
        return;
    }

    for (i = 0; i < formula.length;) {
        if (formula[i] == "^" || formula[i] == "|" || formula[i] == "↔" || formula.includes(">") || formula.includes("⊕")) {
            if (typeof formula[i - 1] == 'undefined' && allowed.test(formula[i + 1])) {
                expression = formula[i];
                newFormulaArray = formula.splice(i, i + 2);
                solve(newFormulaArray, expression, constants);
            } else if (allowed.test(formula[i - 1]) && allowed.test(formula[i + 1])) {
                expression = formula[i];
                newFormulaArray = formula.splice(i - 1, i + 2);
                i = 0;
                solve(newFormulaArray, expression, constants);
            } else {
                alertMessage.innerHTML = '';
                alertMessage.innerHTML = 'Illegal Formula: Double expression!';
                document.getElementById("truthTable").innerHTML = '';
                return;
            }
        } else {
            i++;
        }
    }
}

function removeDuplicates(constants) {
    return constants.filter((value, index) => constants.indexOf(value) === index);
}

function makeExpressionTwo(formula, constants) {

    for (i = 0; i < formula.length + 1; i++) {
        if ((formula.includes("|") || formula.includes("↔") || formula.includes(">") || formula.includes("⊕")) && formula.includes("^")) {
            if (formula.includes("^")) {
                index = formula.findIndex(formula => formula == "^");
            }
            if (formula.includes("|")) {
                index = formula.findIndex(formula => formula == "|");
            }
            if (formula.includes("↔")) {
                index = formula.findIndex(formula => formula == "↔");
            }
            if (formula.includes(">")) {
                index = formula.findIndex(formula => formula == ">");
            }
            if (formula.includes("⊕")) {
                index = formula.findIndex(formula => formula == "⊕");
            }
            var expression = formula[index];
            if (!allowed.test(formula[index - 1])) {
                newFormulaArray = formula.splice(index, index);
                solve(newFormulaArray, expression, constants);
                continue;
            } else if (formula[0] == "|" || formula[0] == "↔" || formula[0] == ">" || formula[0] == "⊕") {
                newFormulaArray = formula.splice(index + 1, index + 3);
                expression = newFormulaArray[1];
                solve(newFormulaArray, expression, constants);
                continue;
            } else if (formula[0] == "^" && index == "^") {
                newFormulaArray = formula.splice(index, index + 1);
                solve(formula, formula[1], constants);
                formula = newFormulaArray;
                continue;
            } else if (allowed.test(formula[index - 1])) {
                if (formula.includes("(")) {
                    var index2 = formula.findIndex(formula => formula == "(");
                    newFormulaArray = formula;
                    formula = newFormulaArray.splice(0, index2 + 1);
                    formula.pop();
                    expression = newFormulaArray[1];
                    solve(newFormulaArray, expression, constants);
                    expression = formula[1];
                    continue;
                }
                if (formula[0] == "^") {
                    newFormulaArray = formula.splice(index - 1, index + 1);
                    expression = newFormulaArray[1];
                    solve(newFormulaArray, expression, constants);
                } else if (formula[1] == "^") {
                    newFormulaArray = formula;
                    formula = newFormulaArray.splice(index, index + 1);
                    expression = newFormulaArray[1];
                    solve(newFormulaArray, expression, constants);
                } else {
                    newFormulaArray = formula;
                    formula = newFormulaArray.splice(index - 1, index + 1);
                    expression = newFormulaArray[1];
                    solve(newFormulaArray, expression, constants);
                }
                continue;
            } else {
                newFormulaArray = formula.splice(index - 1, index);
                solve(newFormulaArray, expression, constants);
                continue;
            }
        } else if ((formula.includes("|") || formula.includes("↔") || formula.includes(">") || formula.includes("⊕")) && !formula.includes("^") && formula.length < 3) {
            if (formula.includes("^")) {
                index = formula.findIndex(formula => formula == "^");
            }
            if (formula.includes("|")) {
                index = formula.findIndex(formula => formula == "|");
            }
            if (formula.includes("↔")) {
                index = formula.findIndex(formula => formula == "↔");
            }
            if (formula.includes(">")) {
                index = formula.findIndex(formula => formula == ">");
            }
            if (formula.includes("⊕")) {
                index = formula.findIndex(formula => formula == "⊕");
            }
            expression = formula[index];
            solve(formula, expression, constants);
            return;
        } else if ((formula[0] == "|" || formula[0] == "↔" || formula.includes(">") || formula.includes("⊕")) && !formula.includes("^") && formula.length > 3) {
            newFormulaArray = formula.splice(1, formula.length - 1);
            expression = newFormulaArray[1];
            solve(newFormulaArray, expression, constants);
            continue;
        } else if ((formula.includes("|") || formula[0] == "↔" || formula.includes(">") || formula.includes("⊕")) && !formula.includes("^") && allowed.test(formula[0])) {
            expression = formula[1];
            newFormulaArray = formula.splice(0, 3);
            solve(newFormulaArray, expression, constants);
            continue;
        } else {
            expression = formula[formula.length - 1];
            solve(formula, expression, constants);
            return;
        }
    }
}

function checkBrackets(str) {

    var depth = 0;

    for (var i in str) {
        if (str[i] == '(') {

            depth++;
        } else if (str[i] == ')') {
            depth--;
        }

        if (depth < 0) return false;
    }

    if (depth > 0) return false;

    return true;
}

function checkAndReplace(formula) {

    for (var i = 0; i < formula.length; i++) {
        if (formula[i] == "=" || formula[i] == "≡") {
            formula[i] = "↔";
        } else if (formula[i] == "→") {
            formula[i] = ">";
        } else if (formula[i] == "&" || formula[i] == "∧") {
            formula[i] = "^";
        } else if (formula[i] == "∨") {
            formula[i] = "|";
        }
    }

    return formula;

}