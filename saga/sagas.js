// ### sagas.js
export function* helloSaga() {
  console.log('Hello Sagas!');
}


// ### main.js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Action } from 'rxjs/internal/scheduler/Action';

import { helloSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(createSagaMiddleware(helloSaga))
)
sagaMiddleware.run(rootSaga)



<button onClick={() => Action('INCREMENT_ASYNC')} />

// ### sagas.js
import { delay } from 'redux-saga'
// put\call 都是Effect的一个类型
/**
 * 如果 Effect 类型是 PUT，那middleware会 dispatch 一个 action 到Store。
 * 如果 Effect 类型是 CALL，那middleware会调用给定的函数，并传参。
 */
import { put, takeEvery, all } from 'redux-saga/effects' 



/**
 * delay和call的不同
 * yield后的表达式 delay(1000) 在被传递给next的调用者之前就被执行了。所以调用者得到的是一个Promise
 * yield call(depay, 1000)，yield后的表达式 call(delay, 1000)被传递给next的调用者。
 *    call就像put，返回一个Effect，告诉middleware使用给定的参数调用给定的函数。
 * 无论是 put 还是 call，都不执行任何dispatch或异步调用，只是简单的返回 plain JavaScript对象。
 * put({type: 'INCREMENT'})  // => { PUT: {type: 'INCREMENT'} }
 * call(deplay, 1000) // => { CALL: {fn: delay, args: [1000]} }
 */
export function* incrementAsync() {
  yield delay(1000) // 返回一个延迟1秒再resolve的Promise
    yield call(delay, 1000) // 
  yield put({ type: 'INCREMENT' }) // 告诉middleware发起dispatch一个INCREMENT的action
}

export function* watchIncrementAsync() {
  // takeEvery用于监控所有 INCREMENT_ASYNC 的action，并在action被匹配时执行 incrementAsync
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export default function* rootSaga() {
  // all() 此两个Generators会同时启动
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}



