// #### 取消任务
// 一旦任务被 fork，可以使用 yield cancel(task) 来终止任务执行。取消正在运行的任务。

/**
 * 在接收到 START_BACKGROUND_SYNC action 后，我们 fork 一个后台任务，周期性地从远程服务器同步一些数据。
 * 这个任务将会一直执行直到一个 STOP_BACKGROUND_SYNC action 被触发。 然后我们取消后台任务，等待下一个 START_BACKGROUND_SYNC action。
 */
import {take, put, call, fork, cancel, cancelled, delay} from 'redux-saga/effects'
import {someApi, actions} from 'somewhere'

function* bgSync() {
  try {
    while(true) {
      yield put(actions.requestStart()) // put 一个action
      const result = yield call(someApi)
      yield put(actions.requestSuccess(result))
      yield delay(5000)
    }
  } finally {
    if (yield cancelled()) {
      yield put(actions.requestFailure('Sync cancelled!'))
    }
  }
}

function* main() {
  while( yield take(START_BACKGROUND_SYNC) ) {
    // 启动后台任务
    const bgSyncTask = yield fork(bgSync)

    // 等待用户的停止操作
    yield take(STOP_BACKGROUND_SYNC)
    // 用户点击了停止，取消后台任务
    // 使得被fork的bgSync任务进入finally区块
    yield cancel(bgSyncTask)
  }
}
