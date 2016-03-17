//Read the input string

var fs = require("fs")
var input = fs.readFileSync("input.ls")
input = input.toString()
//console.log(input)

//Null Parser

function nullParser(string) {
    if (string.substring(0,4) != "null") return string
    return [null, string.substring(4)]
}

//console.log(nullParser(input))

//Boolean Parser

function boolParser(string) {
    if (string.substring(0,4) == "true") return [true, string.substring(4)]
    if (string.substring(0,5) == "false") return [false, string.substring(5)]
    return null
}

//console.log(boolParser(input))

//Number Parser

function numParser(string) {
    var numCheck = /^\d+\.?\d?/
    var token = string.match(numCheck)
    if (token == null) return null 
    var length = token[0].length
    var rest = string.slice(length)
    return [Number(token[0]), rest]
}

//console.log(numParser(input))

//String Parser

function stringParser(string) {
    if (string[0] != '"') return null
    var length = string.lastIndexOf('"')
    var anotherString = string.substring(0, length + 1)
    var rest = string.slice(length + 1)
    return [anotherString, rest]    
}

//console.log(stringParser(input))

//Identifier Parser

function idParser(string) {
    var idCheck = /^[a-zA-Z]\w*/ 
    var token = string.match(idCheck)
    if (token == null) return null 
    var rest = string.slice(token[0].length)
    return [token[0], rest]
}

//console.log(idParser(input))

//Keyword Parser

var keyArray = ["define","lambda","if","quote","let"]

function keywordParser(string) {
    var token = string.split(" ")[0]
    for (var i in keyArray) {
        if (token == keyArray[i]) {
            var rest = string.slice(token.length)
            return [token, rest]
        }
    }
    return null
}


//console.log(keywordParser(input))

//Operator Parser

var operatorArray = ["+", "-", "*", "/", "=", ">", "<", ">=", "<=", "!"]

function operatorParser(string) {
    for (var i in operatorArray) {
        if (string[0] == operatorArray[i]) {
            var rest = string.substring(1)
            return [string[0], rest]
        }
    }
    return null
}

//console.log(operatorParser(input))

//FunctionCall Parser

function functionCallParser(string) {
    var value
    if (value = keywordParser(string)) return value
    if (value = operatorParser(string)) return value
    if (value = idParser(string)) return value
    if (value = expressionParser(string)) return value
    return null 
}

//console.log(functionCallParser(input))

//Space Parser

function spaceParser(string) {
    var spaceCheck = /^\s+/ 
    //console.log(string)
    var token = string.match(spaceCheck)
    if (token == null) return null 
    var rest = string.slice(token[0].length)
    return [token[0], rest]
}

//console.log(spaceParser(input))


//Element Parser

function elementParser(string) {
    var value
    if (value = numParser(string)) return value
    if (value = stringParser(string)) return value
    if (value = boolParser(string)) return value
    if (value = idParser(string)) return value
    if (value = expressionParser(string)) return value
    return null
}

//console.log(elementParser(input))

//Expression Parser

function expressionParser(string) {
    var firstChar = string[0]
    if (firstChar != "(") return null
    string = string.slice(1)
    var tokenArray = []
    var parseResult
    if (parseResult = spaceParser(string)) string = parseResult[1]
    parseResult = functionCallParser(string)
    if (parseResult == null) throw new Error ("Syntax Error")
    tokenArray.push(parseResult[0])
    string = parseResult[1]
    while (string[0] != ")") {
        if (parseResult = spaceParser(string)) string = parseResult[1]
        parseResult = elementParser(string)
        if (parseResult == null) throw new Error ("Element not found")
        tokenArray.push(parseResult[0])
        string = parseResult[1]
        if (parseResult = spaceParser(string)) string = parseResult[1]
    }
    string = string.slice(1)
    return [tokenArray, string]

}

//console.log(expressionParser(input))

//Program Parser

function programParser(string) {
    var parseResult
    var programArray = []
    if (parseResult = spaceParser(string)) string = parseResult[1]
    while (string.length != 0) {
        parseResult = expressionParser(string)
        if (parseResult == null) throw new Error ("Invalid Expression")
        programArray.push(parseResult[0])
        string = parseResult[1]
        parseResult = spaceParser(string)
        string = parseResult[1]
        
    }
    return programArray
}

//console.log(programParser(input))


// Add function

function plus(array) {
    var sum = array.reduce(function(a,b) {
        return a + b
    })
    return sum
}

//console.log(plus(array))

// Minus function

function minus(array){
    var difference = array.reduce(function(a,b) {
        return a - b
    })
    return difference
}

//console.log(minus(array))

//Multiply function

function multiply(array) {
    var product = array.reduce(function(a,b) {
        return a * b
    })
    return product
}

//console.log(multiply(array))

//Divide function

function divide(array) {
    function notZero(x) {
        x = Number(x)
        if (!x) throw new Error ("Divide by zero")
        return x
    }
    var quotient = array.reduce(function(a,b) {
        return a/notZero(b)
    })
    return quotient
}

//console.log(divide(array))

//GreaterThan function

function greaterThan(array) {
    if (array.length == 0) throw new Error ("Too few arguments")
    if (array.length == 1) return true
    var first = array.shift()
    var rest = array
    return (first > rest[0]) && greaterThan(rest)
}


//console.log(greaterThan(array))

//LesserThan function

function lessThan(array) {
    if (array.length == 0) throw new Error ("Too few arguments")
    if (array.length == 1) return true
    var first = array.shift()
    var rest = array
    return (first < rest[0]) && lessThan(rest)
}


//console.log(lessThan(array))

//EqualTo function

function isEqual(array) {
    if (array.length == 0) throw new Error ("Too few arguments")
    if (array.length == 1) return true
    var first = array.shift()
    var rest = array
    return (first == rest[0]) && isEqual(rest)
}

//yconsole.log(isEqual(array))

//GreaterThan or EqualTo function

function greaterThanEqualTo(array) {
    if (array.length == 0) throw new Error("Too few arguments")
    if (array.length == 1) return true
    var first = array.shift()
    var rest = array
    return (first >= rest[0]) && greaterThanEqualTo(rest)
}


//console.log(greaterThanEqualTo(array))

//LesserThan or EqualTo function

function lessThanEqualTo(array) {
    if (array.length == 0) throw new Error ("Too few arguments")
    if (array.length == 1) return true
    var first = array.shift()
    var rest = array
    return (first <= rest[0]) && lessThanEqualTo(rest)
}

//console.log(lessThanEqualTo(array))

// quote function

function quote(array) {
    return array
}

//console.log(quote(array))

var globalEnv = {}

function define(array) {
    globalEnv[array[0]] = array[1]
    
}

var array = [1,'x']
//define(array)
//console.log(globalEnv)

var operatorEnv = {
    '+' : plus,
    '-' : minus,
    '*' : multiply,
    '/' : divide,
    '>' : greaterThan,
    '<' : lessThan,
    '=' : isEqual,
    '>=': greaterThanEqualTo,
    '<=': lessThanEqualTo
}

//console.log(operatorEnv)

function evalExpression(array) {
    var first = array.shift()   
    var rest = array   
    if (operatorEnv.hasOwnProperty(first)) {
        if (rest.every(element => typeof element == "number")) return operatorEnv[first](rest)
    }
}


//console.log(evalExpression(array))


function isIdentifier(element) {
    if (typeof element == "string") {
        if (element[0] != '"') return true
    }
    return false
}



//console.log(isIdentifier(array[1]))










