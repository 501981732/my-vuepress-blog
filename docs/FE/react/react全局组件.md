
### react 全局组件  toast axios阻拦器

```
useage:
Toast.info('普通提示')
Toast.success('成功提示', 3000)
Toast.warning('警告提示', 1000)
Toast.error('错误提示', 2000, () => {
    Toast.info('222')
})
```

```
index.tsx 控制最终对外暴露的接口，根据外界传递的信息调用 Notification 组件的添加方法以向页面中添加提示信息组件
toast.tsx 无状态组件 只负责根据父组件传递的参数渲染为对应提示信息的组件
notification.js toast组件的容器，用于保存页面存在的toast组件并提供Notice组件的添加和移除方法
```


```
toast.tsx
import React from 'react';
import './index.scss';
// 只需要根据 Notification 组件传递的信息输出最终的内容
interface Props {
    type?:string;
    content?:string;
    children?:any;
}
const Toast:React.SFC<Props> = (props) => {
    const { type, content,children } = props
    return (
        <div className={`c-toast ${type}-notice`}>
            {children ? children : content}
        </div>
    )
}

export default React.memo(Toast)
```

```
notification.tsx
import React from 'react'
import {TransitionGroup, CSSTransition } from 'react-transition-group'
import Toast from './toast'
import './index.scss';

export interface Istate {
    notices: any[]
}
export interface Iprops {
    
}
// notice 用于保存当前页面中存在的 Notice 的信息。
// Notification 组件拥有 addNotice 和 removeNotice 两个方法，用于向 notices 中添加和移除 Notice 的信息

export default class Notification extends React.Component<Iprops,Istate> {
    constructor(props:Iprops) {
        super(props)
        this.state = { notices: [] }
    }
    getNoticeKey() {
        const {notices} = this.state
        return `notice-${new Date().getTime()}-${notices.length}`
    }
    addNotice = (notice:any) => {
        const { notices } = this.state
        notice.key = this.getNoticeKey()
        if(notices.every(item => item.key !== notice.key)) {
            notices[0] = notice
            this.setState({ notices })
            if (notice.duration > 0) {
                setTimeout(() => {
                    this.removeNotice(notice.key)
                }, notice.duration)
            }
        }
    }

    removeNotice = (key:string) => {
        this.setState(previousState => ({
            notices: previousState.notices.filter((notice) => {
                if (notice.key === key) {
                    if (notice.onClose) notice.onClose()
                    return false
                }
                return true
            })
        })) 
    }
    render() {
        const {notices} = this.state 
        return (
            <TransitionGroup className="c-toast-notification">
                {
                    notices.map(notice => (
                        <CSSTransition
                            key={notice.key}
                            classNames="c-toast-notice-wrapper c-fade"
                            // timeout={notice.duration}
                            timeout={3000}
                        >
                            <Toast {...notice} />
                        </CSSTransition>
                    ))
                }
            </TransitionGroup>
        )
    }
}
```

```
index.tsx
// 全局组件
//设置默认的参数值，全局创建或销毁Toast的DIV
import React from 'react'
import ReactDOM from 'react-dom'
import Notification from './notification'


interface returnInfo {
    addNotice: (notice:any) => any
    destory: () => void
}
export interface NotificationApi {
    info(args:any): void;
    success(args:any): void;
    error(args:any):void;
    warning(args:any):void;
    open(args:any):void;
    close(args:any):void;
    config(options:any):void;
    destory():void
}
export type noticeInfo = {
    type?:string;
    content: string;
    duration?: string| number;
    onClose():void
}
function createNotification():returnInfo {
    const div:HTMLDivElement = document.createElement('div')
    document.body.appendChild(div)
    const notification = ReactDOM.render((<Notification /> as any),div)
    return {
        addNotice(notice:any) {
            return (notification as any).addNotice(notice)
        },
        destory() {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
        }
    }
}

// 定义一个全局的 notification 变量用于保存 createNotification 返回的对象
let notification:any
const notice = ({type='info', content, duration= 2000, onClose}:noticeInfo) => {
    if (!notification) notification = createNotification()
    return notification.addNotice({ type, content, duration, onClose })
}

const api:any = {
    open() {

    },
    close(key:string) {

    },
    config() {

    },
    destory() {

    }
};
['info','success','error','warning'].forEach(type => {
    api[type] = (args:any) => {
        return notice({...args,type})
    }
})
export default api as NotificationApi

```