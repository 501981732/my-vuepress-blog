 function Dictionary() {
    this.datastore = new Array()
    this.add = add
    this.find = find
    this.count = count
    this.clear = clear
    this.remove = remove
    this.showAll = showAll
 }

 function add(key,value) {
    this.datastore[key] = value
 }

 function find(key) {
    return this.datastore[key]
 }

 function remove(key) {
    delete this.datastore[key]
}


function showAll() {
    let keys = Object.keys(this.datastore).sort()

    for (let i in keys) {
        console.log(keys[i] + '....' + this.datastore[keys[i]] )
    }
}


 function count() {
    return Object.keys(this.datastore).length
 }

 function clear() {
    let keys = Object.keys(this.datastore).sort()

    for (let i in keys) {
       delete this.datastore[keys[i]]
    }
 }

 let demo = new Dictionary()

 demo.add('nike',499)
 demo.add('lining',399)
 demo.add('nb',299)

 console.log(demo.find('nike'))
 console.log(demo)
 demo.showAll()
 console.log(demo.count())
 demo.clear()
 console.log(demo.count())
