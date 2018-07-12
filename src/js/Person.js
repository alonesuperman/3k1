const names = new Set();

export default class Person {
    constructor(name) {
        if (names.has(name)) {
            throw new Error("已经有这个名字了，换个名字");
        }
        this.name = name;
        // 分数
        this.score = 0;

        // 一些收尾工作
        names.add(name);
    }
}
