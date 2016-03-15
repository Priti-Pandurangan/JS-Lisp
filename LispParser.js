//Read the input string

var fs = require("fs")
var input = fs.readFileSync("input.ls")
input = input.toString()
console.log(input)

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

var keyArray = ["define","lambda","if","quote","set","let","begin","cond"]

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
    var expressionArray = []
    if (parseResult = spaceParser(string)) string = parseResult[1]
    while (string.length != 0) {
        parseResult = expressionParser(string)
        if (parseResult == null) throw new Error ("Invalid Expression")
        expressionArray.push(parseResult[0])
        string = parseResult[1]
        parseResult = spaceParser(string)
        string = parseResult[1]
        
    }
    return expressionArray
}

console.log(programParser(input))