function Queue() {
    this.dataStore = []
    this.enqueue = enqueue
    this.dequeue = dequeue
    this.first = first
    this.back = back
    this.empty = empty
    this.toString = toString
}

// 入队
function enqueue(val) {
    this.dataStore.push(val)
}

// 出队
function dequeue() {
    return this.dataStore.shift()
}
// 队首
function first() {
    return this.dataStore[0]
}
// 队尾
function back() {
    return this.dataStore[this.dataStore.length - 1]
}
// 是否为空队列
function empty() {
    return this.dataStore.length === 0
}

function toString() {
    let str = ''
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
        str += this.dataStore[i] + '\n'
    }
    return str
}

let q = new Queue()

// 入队
q.enqueue('wm')
q.enqueue('wmm')
q.enqueue('wmmm')
console.log(q)
// 出队
q.dequeue()
console.log(q)
console.log(q.first())
console.log(q.back())
console.log(q.empty())
console.log(q.toString())

// 实现方块舞的舞伴分配问题

let manDancer = new Queue()
manDancer.enqueue('老王')
manDancer.enqueue('老李')

let womenDancer = new Queue()
womenDancer.enqueue('小王')
womenDancer.enqueue('小李')

function getDancers() {
    return '👱'+ manDancer.dequeue() + '  👩' + womenDancer.dequeue()
}

console.info('第一队舞伴'+ getDancers())
console.info('第二队舞伴'+ getDancers())


// 优先队列 数组

function Patient(name,level) {
    this.name = name
    this.level = level
}
// 优先出队
function dequenePriority() {
    let priority = 0;
    for (let i=0,len=this.dataStore.length;i<len;i++) {
        if (this.dataStore[i.code > ])
    }
}