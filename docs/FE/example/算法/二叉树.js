//节点
function Node(data, left, right) {
    this.data = data
    this.left = left
    this.right = right
    this.show = show
}

function show() {
    return this.data
}

function BST() {
    //空节点
    this.root = null
    this.insert = insert
    this.inOrder = inOrder
    this.getMax = getMax
    this.getSmallest = getSmallest
    this.find = find
    this.inOrder = inOrder
    this.remove = remove
    this.removeNode = removeNode
}

function insert(data) {
    let n = new Node(data, null, null);
    // 判断是否为根节点
    if (this.root == null) {
        this.root = n
    } else {
        let current = this.root
        let parent; //父节点
        //递归
        while (true) {
            // 以当前节点为父节点
            parent = current
            // 数据小于当前节点的值
            if (data < current.data) {
                // 当前值变成变成当前值的左节点
                current = current.left
                // 当前值为空
                if (current == null) {
                    parent.left = n
                    break
                }
            } else {
                // 当前值变成变成当前值的左节点
                current = current.right
                if (current == null) {
                    parent.right = n
                    break
                }
            }
        }
    }
}
//中序操作 先左边
function inOrder(node) {
    // 递归
    if (node) {
        inOrder(node.left)
        console.log(node.data)
        inOrder(node.right)
    }
}

function getSmallest(root) {
    // 一直遍历左边
    let current = this.root || root
    while (current.left != null) {
        // 把当前值变为当前值的左节点
        current = current.left
    }
    return current
}

function getMax() {
    // 一直遍历左右边
    let current = this.root || root
    while (current.right != null) {
        // 把当前值变为当前值的左节点
        current = current.right
    }
    return current
}

function find(data) {
    let current = this.root;
    while(current !=null) {
        if (current = current.data) {
            return current
        } else if(data < current.data) {
            current = current.left
        } else if (data > current.data) {
            current = current.right
        }
    }
    return null
}

function remove(data) {
    removeNode(this.root,data)
}
function removeNode(node,data) {
    if (node == null) {
        return
    } 
    // 比较当前节点和数据 若相等
    if (data == node.data) {
        // 有两个节点
        if (node.left == null && node.right == right) {
            return null
        }
        if (node.left == null) {
            // 把节点放到待删除的位置
            return node.right
        }
        if (node.right == null) {
            return node.left
        }
        let tempNode = getSmallest(node.right)
        node.data = tempNode.data;
        node.right = removeNode(node.right,tempNode.data)
        return node
    } else if (data<node.data) {
        node.left = removeNode(node.left,data)
        return node
    }
    else if (data<node.data) {
        node.right = removeNode(node.right,data)
        return node
    }
}

let nums = new BST()

nums.insert(23)
nums.insert(44)
nums.insert(16)
nums.insert(37)
nums.insert(3)
nums.insert(99)
nums.insert(22)

console.log('遍历节点')

nums.inOrder(nums.root)
console.log('最大',nums.getMax())
console.log('最小',nums.getSmallest())
console.log(nums.root)

nums.remove(22)


nums.inOrder(nums.root)


const tree = [
    {
        id: 1,
        name: '一楼',
        children: [
            {
                id :'11',
                name: '1楼1'
            },
            {
                id :'12',
                name: '1楼2'
            }
        ]
    },
    {
        id: 2,
        name: '2楼',
        children: [
            {
                id :'21',
                name: '2楼1'
            },
            {
                id :'22',
                name: '2楼2'
            }
        ]
    }
]

let arr = []
function deep(root,myId) {
    for (let i=0,len=root.length;i<len;i++) {
        let item = root[i]
        console.log(item)
        if (item.id == myId) {
            arr.push(item)
            
        }
        if (item.children && item.children.length) {
            deep(item.children,myId)
        } 
        // if(item.id == myId) {
        //     console.log(item)
        //     arr.push(item)
        //     // return item 
        // }
        // if (item.children && item.children.length) {
        //     deep(item.children,myId)
        // }
    }
    return arr
}