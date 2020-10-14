import { fork } from 'child_process'
// ### 使用 take Effect 等待 store 中指定的action。
//     使用 call Effect 进行同步调用
//     使用 put Effect 发起action到 store
import { take, call, put, fork, cancel, cancelled } from 'redux-saga/effects'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROE', error})
  }
}

function* loginFlow() {
  while(true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    const token = yield call(authorize, user, password)
    if (token) {
      yield call(Api.storeItem({token}))  // call 不仅可以调用返回promise的函数，还可以调用其他generator函数
      yield take('LOGOUT')
      yield call(Api.clearItem('token'))
    }
  }
}
// 以上问题：假设 loginFlow正在等 call(authorize, user, password)时，用户点击了 Logout 按钮使得LOGOUT action被发起，依然会继续执行授权。
// 解决：需要一个非阻塞调用authorize的方法 FORK，当我们fork一个任务时，任务会在后台启动，既可以继续自己的流程，而不用等待被fork的任务结束。

// const what？？ = yield fork(authorize, user, password) // 无阻塞调用，这里返回值？

function* loginFlow() {
  while(true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    yield fork(authorize, user, password)
    yield take(['LOGOUT', 'LOGIN_ERROR']) // 监听2个并发的action
    yield call(Api.clearItem('token'))
  }
}

// 问题：收到LOGOUT action时，必须取消 authorize 处理进程，否则将有2个并发的任务，并且authorize任务将会继续运行
// 解决：为了取消fork任务，使用 cancel Effect
function* loginFlow() {
  while(true) {
    const {user, password} = yield take('LOGIN_REQUEST')
    // fork return a Task Object
    const task = yield fork(authorize, user, password) // fork 返回的是一个 Task Object
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if (action.type === 'LOGOUT') {
      yield cancel(task)
    }
    yield call(Api.clearItem('token'))
  }
}

// cancel后需要做一些清理工作，使用 cancelled Effect
function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  } finally {
    if (yield cancelled()) {
      // cancellation handling code
    }
  }
}
