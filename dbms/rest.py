# REST 的实质可以理解为： 通过URL定位资源，用GET、POST、PUT、DELETE等动词来描述操作。而满足 REST要求 的接口。
# REST 接口的另一个重要要求：无状态。（指：每个请求都是独立的，不需要服务器在会话Session中缓存中间状态来完成这个请求。
#                                   如果服务器A宕机了，而此时吧这个请求发送服务器B，也能继续完成。这个接口就是无状态）
# 《计算机网络：自顶向下方法》

import requests
import json
import base64
import hmac
import hashlib
import datetime
import time

base_url = "https://api.sandbox.gemini.com"
endpoint = "/v1/order/new"
url = base_url + endpoint

gemini_api_key = "account-zmidXXX"
gemini_api_secret = "375b97HfE7E4tXXXX"

t = datetime.datetime.now()
payload_nonce = str(int(time.mktime(t.timetuple())*1000))

payload = {
  "request": "/v1/order/new",
  "nonce": payload_nonce,
  "symbol": "btcusd",
  "amount": "5",
  "price": "3633.00",
  "side": "buy",
  "type": "exchange limit",
  "options": ["maker-or-cancel"]
}

encoded_payload = json.dumps(payload).encode()
b64 = base64.b64encode(encoded_payload)
signature = hmac.new(gemini_api_secret, b64, hashlib.sha384).hexdigest()

request_headers = {
  "Content-Type": "text/plain",
  "Content-Length": "0",
  "X-GEMINI-APIKEY": gemini_api_key,
  "X-GEMINI-SIGNATURE": signature,
  "Cache-Control": "no-cache"
}

response = requests.post(url, data=None, headers=request_headers)

new_order = response.json()
print(new_order)


# WebSocket 是一种在单个 TCP/TSL 连接上，进行全双工、双向通信的协议。
# WebSocket可以让客户端与服务器之间的数据交换变得更加简单高效。服务端也可以主动向客户端推送数据。
# 在 WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就可以直接创建持久性的连接，并进行双向数据传输。
import websocket
import thread

# 在接收到服务器发送消息时调用
def on_message(ws, message):
  print('Received:' + message)

# 在和服务器建立完成连接时调用
def on_open(ws):
  # 线程运行函数
  def gao():
    for i in range(5):
      time.sleep(0.01)
      msg="{0}".format(i)
      ws.send(msg)
      print('Sent:' + msg)
    time.sleep(1)

  thread.start_new_thread(gao, ())

if __name__ == "__main__":
  ws = websocket.WebSocketApp('ws://echo.websocket.org',
                            on_message = on_message,
                            on_open=on_open)
  ws.run_forever()



import ssl
import websocket
import json

count = 5

def on_message1(ws, message):
  global count
  print(message)
  count -= 1
  if count == 0:
    ws.close()

if  __name__ == "__main__":
  ws = websocket.WebSocketApp(
    "wss:api.gemini.com/v1/marketdata/btcusd?top_of_book=true&offers=true",
    on_message=on_message1
  )
  ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})


