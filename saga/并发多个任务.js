// ### 同时执行多个任务
import { call } from 'redux-saga/effects'
import { race } from 'rxjs'

const [users, repos] = yield [
  call(fetch, '/users'),
  call(fetch, '/repos')
]

// 此方法就像 Promise.all
// 当我们需要 yield 一个包含effects的数组，generator会被阻塞直到所有的 effects都执行完，或者当一个 effect 被拒绝。


// effect 合并器
// 例：在有限的时间内完成一些游戏
function* game(getState) {
  let finished
  while (!finished) {
    const {score, timeout} = yield race({
      score: call(play, getState),
      timeout: call(delay, 60000)
    })

    if (!timeout) {
      finished = true
      yield put(showScore(score))
    }
  }
}
