// #### fork model
// 1. fork 用来创建 attached forks
// 2. spawn 用来创建 detached forks

/**
 * 以下：
 * 整个 task 将阻塞直到一个1秒的delay被传送，并且task1和task2完成了他们的任务
 */

function* fetchAll() {
  const task1 = yield fork(fetchResource, 'users')
  const task2 = yield fork(fetchResource, 'comments')
  yield call(delay, 1000)
}

function* fetchResource(resource) {
  const {data} = yield call(api.fetch, resource)
  yield put(receiveData(data))
}

function* main() {
  yield call(fetchAll)
}


/**
 * 另一种实现方法，使用平行Effect
 */
function* fetchAll() {
  yield all([
    call(fetchResource, 'users'), // task1
    call(fetchResource, 'comments'), // task2
    call(delay, 1000)
  ])
}

// Error 传播
function* main() {
  try {
    yield call(fetchAll)
  } catch(e) {
    // handle fetchAll errors
  }
}
