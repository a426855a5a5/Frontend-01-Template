/**
 * js中的有限状态机
 * 每个函数是一个状态
 *  函数的参数就是输入
 *  在函数中，可以自由地编写代码，处理每个状态的逻辑
 *
 * while(input){
 *  state = state(input) // 把状态机的返回值作为下一个状态。
 * }
 * */
function match(string) {
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