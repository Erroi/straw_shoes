// #### 多个 Effects 之间启动 race
// 类似于 promise.race。同时启动多个任务，拿到第一个被resolve或reject。
import {race, call, put} from 'redux-saga/effects'
import {delay} from 'redux-saga'

function* fetchPostsWithTimeout() {
  const {posts, timeout} = yield race({
    posts: call(fetchApi, '/posts'),
    timeout: call(delay, 1000)
  })

  if (posts) {
    put({type: 'POSTS_RECEIVED', posts})
  } else {
    put({type: 'TIMEOUT_ERROR'})
  }
}

