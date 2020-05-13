var set = new Set();
var objectscc = [
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect"
];

var queue = [];
for (let p of objectscc) {
    queue.push({
        path: [p],
        object: this[p]
    })
}
let current;
while (queue.length) {
    current = queue.shift();
    console.log(current.path.join('.'));
    if (set.has(current.object))
        continue;
    set.add(current.object);
    for (let p of Object.getOwnPropertyNames(current.object)) {
        var property = Object.getOwnPropertyDescriptor(current.object, p);

        if (property.hasOwnProperty("value") &&
            ((property.value != null) && (typeof property.value == 'object') || (typeof property.value == 'object'))
            && property.value instanceof Object)
            queue.push({
                path: current.path.concat([p]),
                object: property.value
            })
        if (property.hasOwnProperty("get") && (typeof property.get == 'function'))
            queue.push({
                path: current.path.concat([p]),
                object: property.get
            })
        if (property.hasOwnProperty("set") && (typeof property.set == 'function'))
            queue.push({
                path: current.path.concat([p]),
                object: property.set
            })
    }
}

var arr = [
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Array",
    "Date",
    "RegExp",
    "Promise",
    "Proxy",
    "Map",
    "WeakMap",
    "Set",
    "WeakSet",
    "Function",
    "Boolean",
    "String",
    "Number",
    "Symbol",
    "Object",
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "Atomics",
    "JSON",
    "Math",
    "Reflect",
    "Array.prototype",
    "Date.prototype",
    "RegExp.prototype",
    "RegExp.input",
    "RegExp.$_",
    "RegExp.lastMatch",
    "RegExp.$&",
    "RegExp.lastParen",
    "RegExp.$+",
    "RegExp.leftContext",
    "RegExp.$`",
    "RegExp.rightContext",
    "RegExp.$'",
    "RegExp.$,1",
    "RegExp.$,2",
    "RegExp.$,3",
    "RegExp.$,4",
    "RegExp.$,5",
    "RegExp.$,6",
    "RegExp.$,7",
    "RegExp.$,8",
    "RegExp.$,9",
    "Promise.prototype",
    "Map.prototype",
    "WeakMap.prototype",
    "Set.prototype",
    "WeakSet.prototype",
    "Boolean.prototype",
    "String.prototype",
    "Number.prototype",
    "Symbol.prototype",
    "Error.prototype",
    "EvalError.prototype",
    "RangeError.prototype",
    "ReferenceError.prototype",
    "SyntaxError.prototype",
    "TypeError.prototype",
    "URIError.prototype",
    "ArrayBuffer.prototype",
    "SharedArrayBuffer.prototype",
    "DataView.prototype",
    "Float32Array.prototype",
    "Float64Array.prototype",
    "Int8Array.prototype",
    "Int16Array.prototype",
    "Int32Array.prototype",
    "Uint8Array.prototype",
    "Uint16Array.prototype",
    "Uint32Array.prototype",
    "Uint8ClampedArray.prototype",
    "RegExp.prototype.dotAll",
    "RegExp.prototype.flags",
    "RegExp.prototype.global",
    "RegExp.prototype.ignoreCase",
    "RegExp.prototype.multiline",
    "RegExp.prototype.source",
    "RegExp.prototype.sticky",
    "RegExp.prototype.unicode",
    "Map.prototype.size",
    "Set.prototype.size",
    "Symbol.prototype.description",
    "ArrayBuffer.prototype.byteLength",
    "SharedArrayBuffer.prototype.byteLength",
    "DataView.prototype.buffer",
    "DataView.prototype.byteLength",
    "DataView.prototype.byteOffset",
]
