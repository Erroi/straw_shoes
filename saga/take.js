// ### take
// takeEvery 只是一个在强大低阶 API 之上构建的wrapper effect。effect以在每个action来到时派生一个新的任务。
// 而 take 让我们通过全面控制 action 观察进程来构建复杂的控制流成为可能。

// takeEvery 实现一个简单的日志记录器
import { select, takeEvery, take, put } from 'redux-saga/effects'

function* watchAndLog() {
  // takeEvery的问题：被调用的任务无法控制开始和停止，每次action被匹配时一遍一遍的被调用。
  yield takeEvery('*', function* logger(action) {
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  })
}

// 如何使用 take Effect 来实现和上面相同功能：
function* watchAndLog02() {
  while(true) {
    const action = yield take('*') // take:会暂停Generator，直到一个匹配的action被发起了。
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  }
}

// saga是自己主动拉取 action的。便可以实现控制
function* watchFirstThreeTodosCreation() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}
// 在 take初次的3个 TODO_CREATED action 之后， Saga 会显示祝贺信息并终止。
// Generator 会被回收并且相应的监听不会再发生。

// 同时可以在一个集中的地方更好的描述一个非常规的流程
function* loginFlow() {
  while(true) {
    yield take('LOGIN')
    // ... perform the login logic
    yield take('LOGOUT')
    // ... perform the logout logic
  }
}


