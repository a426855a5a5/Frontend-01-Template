/** *
 * 每一个状态都是一个机器
 *  在每个机器里，我们可以做计算，存储，输出。。。。
 *  所有的这些机器接受的输入是一致的
 *  状态机的每一个机器本身没有状态，如果我们用函数来表示的话，他应该是纯函数（无副作用）
 * 每一个机器知道下一个状态
 *  每一个机器都有确定的下一个状态（moore）
 *  每一个机器根据输入的决定下一个状态（mealy）
 * 
 */
// 匹配a
var str = 'dsadwfwfqf';
const match1 = (str) => {
    for (let c of str) {
        if (c === 'a') {
            return true
        }
        return false
    }
}
match1(str)

// 匹配ab
const match2 = (str) => {
    var found = false
    for (let c of str) {
        if (c === 'a') {
            found = true
        } else if (found && c === 'b') {
            return true
        } else {
            found = false
        }
        return false
    }
}

// 匹配abcdef
const match3 = (str) => {
    var foundA = false;
    var foundB = false
    var foundC = false
    var foundD = false
    var foundE = false

    for (let c of str) {
        if (c === 'a') {
            foundA = true
        } else if (foundA && c === 'b') {
            foundB = true
        } else if (foundB && c === 'c') {
            foundC = true
        } else if (foundC && c === 'd') {
            foundD = true
        } else if (foundD && c === 'e') {
            foundE = true
        } else if (foundE && c === 'f') {
            return true
        } else {
            var foundA = false;
            var foundB = false;
            var foundC = false;
            var foundD = false;
            var foundE = false;
        }
        return false
    } function match(string) {
        let state = start;
        for (let c of string) {
            state = state(c);
        }
        return state === end;
    }

    function start(c) {
        if (c === 'a') {
            return foundA;
        } else {
            return start;
        }
    }

    function end(c) { // 陷阱状态。
        return end;
    }

    function foundA(c) {
        if (c === 'b') {
            return foundB;
        } else {
            return start;
        }
    }

    function foundB(c) {
        if (c === 'c') {
            return foundC;
        } else {
            return start;
        }
    }

    function foundC(c) {
        if (c === 'd') {
            return foundD;
        } else {
            return start;
        }
    }

    function foundD(c) {
        if (c === 'e') {
            return foundE;
        } else {
            return start;
        }
    }

    function foundE(c) {
        if (c === 'f') {
            return end;
        } else {
            return start;
        }
    }
}


