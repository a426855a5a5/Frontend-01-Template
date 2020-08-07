// const addCSS = require('./addCSSRules.js')
const css = require('css');
const layout = require('./layout.js');

let currentToken = null;
let currentAttribute = null;

let stack = [{ type: "document", children: [] }];
let currentTextNode = null;
/** 
 * 遇到style标签时，我们把css规则保存起来
 * 这里我们调用cssparser来分析css规则
 * 这里我们必相要仔细研究此库分析css规则的
*/

let rules = [];
function addCSSRules(text) {
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, "     "))
    rules.push(...ast.stylesheet.rules);
}

/** 
 * 当我们创建一个元素后，立即计算css
 * 理论上，当我们分析一个元素时，所有css规则已经收集完毕
 * 在真实浏览器中，可能遇到写在body的style标签，需要重新计算css的情况，这里我们忽略
 * css 重新计算会触发重排，重排会触发重绘
 * */

/** 
* 在computeCSS函数中，我们 必须知道元素的所有父元素才能判断元素与规则是否匹配
* 我们从上一步骤的stack，可以获取本元素所有的父元素
* 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是冲内向外
* */

function match(element, selector) {
    if (!selector || !element.attributes) {
        return false
    }

    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === selector.replace("#", ''))
            return true
    } else if (selector.charAt(0) == ".") {
        var attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace(".", ''))
            return true
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

}

function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0]

    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1]

    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2]

    return sp1[3] - sp2[3];
}

function computeCSS(element) {
    var elements = stack.slice().reverse();
    if (!element.computedStyle)
        element.computedStyle = {};

    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0]))
            continue;

        let matched = false;

        var j = 1;
        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length)
            matched = true;

        if (matched) {

            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {}

                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
            }
        }
    }

    // let inline = element.attributes.filter(p => p.name == "style");
    // parse("* {"+ inline +"}")
    // sp = [1,0,0,0]
}


function emit(token) {
    let top = stack[stack.length - 1];

    if (token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }

        element.tagName = token.tagName;

        for (let p in token) {
            if (p != "type" || p != "tagName")
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
        }

        computeCSS(element); // 为什么要放这里？

        top.children.push(element);
        if (!token.isSelfClosing)
            stack.push(element);

        currentTextNode = null;
    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            if (top.tagName == 'style') {
                addCSSRules(top.children[0].content);
            }
            layout(top); // 处理
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}
var arr = [{ "type": "document", "children": [{ "type": "element", "children": [{ "type": "text", "content": "\n" }, { "type": "element", "children": [{ "type": "text", "content": "\n    " }, { "type": "element", "children": [{ "type": "text", "content": "\nbody div #myid{\n    width:100px;\n    background-color: #ff5000;\n}\nbody div img{\n    width:30px;\n    background-color: #ff1111;\n}\n    " }], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "style" }], "tagName": "style" }, { "type": "text", "content": "\n" }], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "head" }], "tagName": "head" }, { "type": "text", "content": "\n" }, { "type": "element", "children": [{ "type": "text", "content": "\n    " }, { "type": "element", "children": [{ "type": "text", "content": "\n        " }, { "type": "element", "children": [], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "img" }, { "name": "id", "value": "myid" }, { "name": "isSelfClosing", "value": true }], "tagName": "img" }, { "type": "text", "content": "\n        " }, { "type": "element", "children": [], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "img" }, { "name": "isSelfClosing", "value": true }], "tagName": "img" }, { "type": "text", "content": "\n    " }], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "div" }], "tagName": "div" }, { "type": "text", "content": "\n" }], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "body" }], "tagName": "body" }, { "type": "text", "content": "\n" }], "attributes": [{ "name": "type", "value": "startTag" }, { "name": "tagName", "value": "html" }, { "name": "maaa", "value": "a" }], "tagName": "html" }] }]


const EOF = Symbol("EOF"); // EOF : end of file
function data(c) {
    if (c == '<') {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: "EOF",
        })
        return data;
    } else {
        emit({
            type: "text",
            content: c
        })
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else {
        emit({
            type: "text",
            content: c
        })
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c);
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c //.toLowerCase();
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}
function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        return beforeAttributeName;
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName;
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {
        // return data;
    } else {
        return UnquotebAttributeValue(c);
    }
}

function UnquotebAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken)
        return data
    } else if (c == "\u0000") {
        return singleQuotedAttributeValue;
    } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {
        // return data;
    } else if (c == EOF) {
        // return data;
    } else {
        currentAttribute.value += c
        return UnquotebAttributeValue;
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {
        // return data;
    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {
        // return data;
    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken)
        return data
    } else if (c == EOF) {
        // return data;
    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue;
    }
}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return data;
    } else if (c == 'EOF') {

    } else {

    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken)
        return data
    } else if (c == EOF) {
        // return data;
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: "",
        }
        return attributeName(c);
    }
}

// function parseHTML(html) {
//     let state = data;

//     for (let c of html) {
//         state = state(c);
//     }
//     state = state(EOF);
// }

// parseHTML(`<html maaa=a >
// <head>
//     <style>
// #container {
//     width:500px;
//     height: 300px;
//     display:flex;
//     background-color:rgb(255, 0, 255);
// }    
// #container .c1 {
//     width: 200px;
//     height: 100px;
//     background-color:rgb(255,0,0);
// }
// #container .c1 {
//     flex:1;
//     background-color:rgb(0,255,0);
// }
//     </style>
// </head>
// <body>
//     <div id="container">
//         <div id="myid"></div>
//         <div class="c1"></div>
//     </div>
// </body>
// </html>`)

module.exports.parseHTML = function parseHTML(html) {
    let state = data;

    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}