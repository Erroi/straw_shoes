// ### Put
// 发起 action 通知 Store 数据获取成功了

const { assert } = require("console")

function* fetchProducts(dispatch) {
  const products = yield call(Api.fetch, '/products')
  dispatch({ type: 'PRODUCTS_RECEIVED', products })
}
 // 而要测试 fetchProducts 接收到Ajax响应之后执行 dispatch，还需要模拟 dispatch 函数。
 // 所以采用同样的声明式的解决方案。创建一个对象来指示 middleware需要发起一些action，然后让middleware执行真实的dispatch。
 // redux-saga 提供了函数 put，用于创建 dispatch Effect

function* fetchProducts01() {
  const products = yield call(Api.fetch, '/products')
  yield put({ type: 'PRODUCTS_RECEIVED', products })
}

assert.deepEqual(
  iterator.next(products).value,
  put({ type: 'PRODUCTS_RECEIVED', products }),
  'fetchProducts should yield an Effect put({type: "PRODUCTS_RECEIVED", products})',
)



// ### 错误处理
// 1. try/catch
function* fetchProducts02() {
  try {
    const products = yield call(Api.fetch, '/products')
    yield put({ type: 'PRODUCTS_RECEIVED', products })
  } catch(error) {
    yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
  }
}

// 2. api 处理
function fetchProductsApi() {
  return Api.fetch('/products')
    .then(response => ({response}))
    .catch(error => ({error}))
}

function* fetchProducts03() {
  const { response, error } = yield call(fetchProductsApi)
  if (response) {
    yield put({ type: 'PRODUCTS_RECEIVED', products: response })
  } else {
    yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
  }
}

