// 匹配abcabx
// 可选 通过闭包生成状态机。

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
        return start(c);
    }
}

function foundB(c) {
    if (c === 'a') {
        return foundA1;
    } else {
        return start(c);
    }
}

function foundA1(c) {
    if (c === 'b') {
        return foundB1;
    } else {
        return start(c);
    }
}

function foundB1(c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start(c);
    }
}

function foundA2(c) {
    if (c === 'b') {
        return foundB3;
    } else {
        return foundB(c);
    }
}

function foundB3(c) {
    if (c === 'x') {
        return end;
    } else {
        return foundB1(c);
    }
}


console.log(match('abDSAababsabx'))
