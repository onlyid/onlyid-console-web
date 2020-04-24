import EventEmitter from "eventemitter3";

export const eventEmitter = new EventEmitter();

export function getRandomValue(length = 32) {
    let s = "";
    while (s.length < length) {
        s += Math.random()
            .toString(36)
            .substr(2);
    }

    // 可能超长 截取一下
    if (s.length > length) s = s.substr(0, length);
    return s;
}

Storage.prototype.getObj = function(key) {
    const s = this.getItem(key);
    if (!s) return null;

    return JSON.parse(s);
};

Storage.prototype.setObj = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};
