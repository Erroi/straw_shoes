### 浏览器安全

##### web页面安全

> 同源策略

    如果两个URL的协议、域名和端口都相同，我们就说这两个url同源。两个同源之间可以互相访问资源或操作DOM，这一套基础的安全策略的制约，称为「同源策略」。
    
> 主要表现层面

  * DOM层面
    同源策略限制了不同源的js脚本对当前DOM对象的读和写操作

  * 数据层面
    同源策略限制了不同源的站点读取当前站点的cookie、indexDB、localStorage等数据。
  
  * 网络层面
    同源策略限制了通过XMLHttpRequest等方式将站点的数据发送给不同源的站点

> 浏览器妥协了同源策略中的哪些安全性

  * 页面中可以嵌入第三方资源
    js、css、png等会部署到不同的CDN上，CDN上的资源就部署在另一个域名上

    --> 引发了XSS攻击（跨站脚本攻击cross Site Script）
        如用户非法输入<script>alert('sss')</script>; url?param=<script...>等

        --> CSP 内容安全策略（为预防XSS，引入了CSP「content security policy」）配置你的网络服务器返回  Content-Security-Policy  HTTP头部(x-xss-protection 为不支持CSP的浏览器提供保护)
            让服务器决定浏览器能够加载哪些资源，决定浏览器是否能够执行内联js代码
        
        --> 过滤和标签转码
        --> 使用 HttpOnly 属性，可以禁止 document.cookie 获取到相应的cookie；（服务器通过HTTP响应头设置set-cookie：xxx..xx;httpOnly）

  * 跨域资源共享和跨文档消息机制
    （CORS：跨域资源共享）改机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。
    （跨文档机制）可以通过 window.postMessage的js接口和不同源的DOM进行通信


> CSRF 攻击

  * CSRF 攻击 ：跨站点请求伪造（Cross Site Request Forgery）
              引诱用户打开黑客的网站，在黑客的网站中，利用**用户的登录状态发起跨站请求**。
            
            1. 自动发起 Get 请求，
                  <img src="https://time.geekbang.org/sendcoin?user=hacker&number=100">

            2. 自动发起 Post 请求。
                  <form id='hacker-form' action='https://time.geekbang.org/sendcoin' method='POST'>
                    <input type='hidden' name='user' value='hacker'>
                    <input type='hidden' name='number' value='100'>
                  </form>
                  <script>
                    document.getElementById('hacker-form').submit()
                  </script>

            3. 引诱用户点击链接
                  <img src="beautiful picture">
                  <a href="https://time.geekbang.org/sendcoin?user=hacker&number=100">点击下载美图</a>

> 服务器预防 CSRF 

  * 设置好cookie的SameSite属性
    SameSite: Strict 表示从其他域请求当前A的资源，这个请求是不会携带Cookie发送至服务器的
              Lax 从第三方站点打开链接或 GET夯实会携带cookie。但Post img，iframe加载的URL不会携     带Cookie
              None 任何情况从第三方的请求都不会携带cookie

  * 验证请求涞源的站点
    Referer：https://yuming.com/second/tlll；
    Origin： https://yuming.com；只有一级域名，不包含路径信息


> 操作系统的安全保障：安全沙箱（页面和系统之间的隔离墙）

  XSS攻击：只是将恶意的js脚本注入到页面中，窃取cookie相关数据，但是XSS无法对操作系统进行攻击。
  缓冲区溢出：通过浏览器漏洞进行的攻击是可以入侵到浏览器进程内部的，可以读取和修改浏览器进程内部的任意内容，还可以穿透浏览器，在用户的操作系统上悄悄安装恶意软件、监听用户键盘输入信息及读取用户硬盘上的文件内容。

  > 浏览器被划分为 浏览器内核 和 渲染内核 两个核心模块
  * 浏览器内核：网络进程、浏览器主进程、GPU进程
      > 职责：Cookie存储、Cache存储、网络请求、文件读取、下载管理、SSL/TSL、浏览器窗口管理
      > 下载所有的网络资源，通过 IPC 将其提交给 渲染进程。
  * 渲染内核：渲染进程
      > HtmL解析、CSS解析、图片解码、js执行、布局、绘制、XML解析
      > 渲染进程会对这些资源进行解析、绘制等操作，最终生成一副图片。将这个图片交给 浏览器内核模块负责显示这张图。
  
  渲染进展和操作系统之间建一道墙，即便渲染进程由于存在漏洞被黑客攻击，但由于这道墙（安全沙箱）就获取不到渲染进程之外的任何操作权限。

  * 站点隔离
    > 指Chrome将同一站点（包含相同根域名和相同协议的地址）中相互关联的页面放到同一个渲染进程中执行。
    > 以iframe级的渲染进程，然后按照同一站点的策略来分配渲染进程，这就是Chrome中的站点隔离。



> HTTPS 网络安全
  * HTTP： 数据链路层  ->  IP  ->  TCP  ->  HTTP
  * HTTPS: 数据链路层  ->  IP  ->  TCP  -> SSL/TLS安全层  -> HTTP

  * 安全层：对发起 HTTP 请求的数据进行加密操作、对接收到的HTTP的内容进行解密操作。
    1. 使用对称加密：指加密和解密都使用的是相同的密钥。
    2. 使用非对称加密：A、B两把密钥，如果用A加密，则B就只能解密，反之亦然。
        > 服务器会将其中的一个密钥通过明文的形式发送给浏览器（公钥），服务器自己留下的那个密钥称为私钥。
        > 公钥是每个人都能获取到的，而私钥只有服务器才能知道，不对任何人公开。
        缺：1. 效率低
            2. 无法保证服务器发送给浏览器的数据安全。（因为公钥是明文，服务器只能用私钥加密）
    3. 对称加密和非对称加密搭配使用
        > 在传输数据阶段依然使用对称加密，但是对称加密的密钥采用非对称加密来传输。
    4. 添加数字证书：权威机构颁发的一个证书，来证明“我就是我”
        > 服务器没有直接返回公钥给浏览器，而是返回了数字证书，公钥就包含在数字证书中。
        > 浏览器端多了一个证书验证的操作，验证来证书之后才会继续后续流程。




