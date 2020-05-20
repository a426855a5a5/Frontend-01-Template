const css = require('css');
/** 
 * 遇到style标签时，我们把css规则保存起来
 * 这里我们调用cssparser来分析css规则
 * 这里我们必相要仔细研究此库分析css规则的
*/

let rules = [];
module.exports.addCSSRules = function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, "     "))
    rules.push(...ast.stylesheet.rules);
}

/** 
 * 当我们创建一个元素后，立即计算css
 * 理论上，当我们分析一个元素时，所有css规则已经收集完毕
 * 在真实浏览器中，可能遇到写在body的style标签，需要重新计算css的情况，这里我们忽略
 * css 重新计算会触发重排，重排会触发重绘
 * */

module.exports.computeCSS = function computeCSS(element) {
    console.log(rules);
    console.log('compute CSS for Element', element)
}
