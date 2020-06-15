##### 核心概念 Pod
* 最小的调度以及资源单元
* 由一个或者多个容器组成
* 定义容器运行的方式（Command、环境变量）
* 提供给容器共享的运行环境（网络、进程空间）

##### 核心概念 Volume
* 声明在 Pod 中的容器可访问的文件目录
* 可以被挂载在 Pod 中一个或多个容器的指定目录
* 支持多种后端存储的抽象
  * 本地存储、分布式存储、云存储。。。

##### 核心概念 Deployment
* 定义一组 Pod 的副本数目、版本等
* 通过控制器 Controller 维持 Pod 的数目
  * 自动恢复失败的 Pod
* 通过控制器以指定的策略控制版本
  * 滚动升级、重新生成、回滚等

##### 核心概念 Service
* 提供访问一个或多个 Pod 实例的稳定访问地址
* 支持多种访问方式实现
  * ClusterIP
  * NodePort
  * LoadBanlancer

#### 核心概念 Namespace
* 一个集群内部的逻辑隔离机制（鉴权、资源额度）
* 每个资源都属于一个 Namespace
* 同一个 Namespace 中的资源命名唯一
* 不同 Namespace 中的资源可重名

##### 容器的本质是：
* 一个视图被隔离、资源受限的**进程**单进程模型
  * 容器 PID=1 的进程就是应用本身
    * 管理虚拟机 = 管理基础设施；管理容器 = 直接管理应用本身
* kubernetes 就是云时代的**操作系统**
  * 容器镜像其实就是这个操作系统的软件安装包
* Pod 则类似于一个**进程组**，是一个逻辑单位（多个容器的组合），是kubernetes的原子调度单位。

##### Pod 要解决的核心问题
* 如何让一个 Pod 里的多个容器之间最高效的共享某些资源和数据？
  容器之间原本是被 Linux Namespace 和 cgroups 隔开的
  * 通过 Infra Container 的方式共享同一个Network Namespace：
  * 一个 Pod 只有一个 IP 地址，也就是这个 Pod 的 Network Namespace 对应的 IP 地址
  * 整个 Pod 的生命周期根 Infra 容器一致，而与容器A和B无关
* 如何共享存储
  * shared-data （这个 Volume）对应在宿主机上的目录会被同时绑定挂载进 Pod的容器中
  * **Init Container**会比spec.containers定义的用户容器先启动，并且严格按照定义顺序依次执行
  * Tomcat容器，同样声明了挂载该Volume到自己的webapps目录下
  * 当 Tomcat 容器启动时，它的 webapps 目录下就一定会存在sample.war文件
  
  ```
  apiVersion: v1
  kind: Pod
  metadata:
    name: javaweb-2
  spec:
    initContainers:
    - image: resouer/sample:v2
      name: war
      command: ["cp", "/sample.war", "/app"]
      volumeMounts:
      - mountPath: /app
        name: app-volume
    containers:
    - image: resouer/tomcat:7.0
      name: tomcat
      command: ['sh', '-c', '/root/apache-tomcat-7.0.42-v2/bin/start.sh']
      volumeMounts:
      - mountPath: /root/apache-tomcat-7.0.42-v2/webapps
        name: app-volume
      ports:
      - containerPort: 8080
        hostPort: 8001
    volumes:
    - name: app-volume
      emptyDir: {}
  ```
* 容器设计模式：Sidecar
通过在 Pod 里定义专门容器，来执行主业务容器需要的辅助工作。
将辅助功能同主业务容器解耦， 实现独立发布和能力重用
  * 原本需要 SSH 进去执行的脚本
  * 日志收集
    业务容器将日志写在 Volume 里
    日志容器共享该 Volume 从而将日志转发到远程存储当中
  * Debug 应用
  * 应用监控
  * 代理容器
    代理容器对业务容器屏蔽被代理的服务集群，简化业务代码的实现逻辑
    容器之间通过 localhost 直接通信

* label
`kubectl get pods nginx1 -o yaml | less`
`kubectl get pods --show-labels [-l env=test,tie=front]`
`kubectl get pods --show-labels [-l 'env in (test, dev)']`
`kubectl get pods --show-labels [-l 'env notin (test, dev)']`
`kubectl label pods nginx1 env=test1 --overwrite`
`kubectl annotate pods nginx1 my-annotate='my comment, ok'`
* annotations
  * 存储资源的非标示性信息
  * 扩展资源的 spec/status
* Ownereference
  * ‘所有者’即集合类资源
    * Pod的集合：replicaset， statefulset
  * 集合类资源的控制器创建了归属资源
    * Replicaset 控制器创建 pod
    `kubectl get replicaset`
  作用：方便反向查找创建资源的对象
       方便进行级联删除
      
* 控制器模式总结：
  声明式 API   控制器
  Deployment  DP controller
  ReplicaSet  RS controller
  Service     Svc controller
  * 由声明式 API 驱动 - K8S资源对象
  * 由控制器异步的控制系统向终态驱进
  * 便于扩展-自定义资源和控制器


##### 应用编排与管理： Deployment
> 管理部署发布的控制器
* 定义一组Pod的期望数量，controller会维持Pod数量与期望数量一致
* 配置Pod发布方式，controller会按照给定策略更新Pod，保证更新过程中不可用的pod数量在限定范围内
* 支持一键回滚
* 更新镜像
  `kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1`
  `kubectl get deployment nginx-deployment -o yaml | less`
  回滚：`kubectl rollout undo deployment/nginx-deployment`
       `kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2`
       `kubectl rollout history deployment.v1.apps/nginx-deployment`

* 管理模式
  * Deployment只负责管理不同版本的ReplicaSet，由ReplicaSet管理Pod副本数
  * 每个ReplicaSet对应里Deployment template的一个版本
  * 一个 ReplicaSet下的Pod都是相同的版本


##### Job：管理任务的控制器
* Job能做什么
  1. 创建一个或多个Pod确保指定数量的Pod可以成功地运行终止
  2. 跟踪Pod状态，根据配置及时重试失败的Pod
  3. 确定依赖关系，保证上一个任务运行完毕后再运行下一个任务
  4. 控制任务并行度，并根据配置确保Pod队列大小
  ```
  apiVersion: batch/v1
  kind: Job
  metadata:
    name: pi
  spec:
    template:
      spec:
        containers:
        - name: pi
          image: perl
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
        restartPolicy: Never  # 重启策略
    backoffLimit: 4  # 重试次数
  ```
  * CronJob 定时job
  ```
  apiVersion: batch/v1beta1
  kind: CronJob
  metadata:
    name: hello
  spec:
    schedule: "*/1***"
    jobTemplate:
      spec:
        template:
          spec:
            containers:
            - name: hello
              image: busybox
              args:
              - /bin/sh
              - -c
              - data; echo Hello
            restartPolicy: OnFailure
    startingDeadlineSeconds: 10 # Job最长启动时间
    concurrencyPolicy: Allow  #是否允许并行运行
    successfulJobsHistoryLimit： 3  # 允许留存历史job个数
  ```
  `kubectl create -f job.yaml`
  * 管理模式
    1. Job Controller 负责根据配置创建Pod
    2. Job Controller 跟踪Job状态，根据配置及时重试Pod或者继续创建
    3. Job Controller 会自动添加label来跟踪对应的pod，并根据配置并行或串行创建Pod

##### DaemonSet
1. 保证集群内的每个节点（或一些）都运行一组相同的Pod
2. 跟踪集群节点状态，保证新加入的节点自动创建对应的Pod
3. 跟踪集群节点状态，保证移除的节点删除对应的Pod
4. 跟踪Pod状态，保证每个节点Pod处于运行状态
- 应用场景：
  1. 集群存储进程：glusterd，ceph
  2. 日志收集进程：fluentd，logstash
  3. 需要在每个节点运行的监控收集器
`kubectl create -f daemonSet.yaml`


##### 应用配置管理
> 除了依托容器镜像来定义运行的 Container，Pod还需要解决的问题
1. 不可变基础设施（容器）的可变配置：ConfigMap
2. 敏感信息的存储和使用（密码，token）: Secret
3. Pod自我身份认证: ServiceAccount
4. 容器运行资源的配置管理: Spec.Containers[].Resources.limits/requests
5. 容器的运行安全管控: Spec.Containers[].SecurityContext
6. 容器启动前置条件校验: Spec.InitContainers

* Secret
> base64编码保存
```
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
  namespace: kube-system
type: Opaque
data:
  username: xxx
  password: ssss
```

* ServiceAccount
> 主要用于解决 Pod 在集群中的身份认证问题。认证使用的授权信息，则利用前面讲到的Secret（type=kubernetes.io/service-account-token）进行管理
```
apiVersion: v1
kind: ServiceAccount
secrets:
- name: default-token-6fn7q
```
```
apiVersion: v1
kind: Secret
data:
  ca.crt: LSO... #用于校验服务端的证书信息，base64编码
  namespace: ZGVmYXVsda==
  token:ZXLKa...  # Pod的身份证用的Token、base64编码
metadata:
  annotations:
    kubernetes.io/service-account.name: default
    kubernetes.io/service-account.uid: 320061-85da...
type: kubernetes.io/service-account-token
```

* Security Context
> 用于限制容器的行为，从而保障系统和其他容器的安全。
1. Discretionary Access Control：根据用户id和组id来控制文件访问权限
2. SELinux：通过 SELinux 的策略配置控制用户，进程等
3. privileged：容器是否为特权模式
4. Linux Capabilities：给特定进程配置 privileged能力
5. AppArmor：控制可执行文件的访问控制权限（读写文件/目录，网络端口读写）
6. Seccomp：控制进程可以操作的系统调用
7. AllowPrivilegeEscalation：控制一个进程是否能比其他父进程获取更多的权限
```
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - securityContext:
    allowPrivilegeEscaletion: false
```

* InitContainer
> InitContainer用于普通Container启动前的初始化（如配置文件准备）或者普通Container启动前置条件检验
1. InitContainer优先于普通Container启动执行，成功后才会启动普通Container
2. Pod中多个InitContainer之间是按次序依次启动执行，而普通Container是并行启动
3. InitContainer执行成功后就结束退出了，而普通容器会一直执行或重启restart


##### Pod Volumes
>  一个pod中的某个容器异常退出，被kubelet拉起如何保证之前产生的重要数据不丢？
>  同一个Pod的多个容器如何共享数据？
Kubernetes Volume 类型：
1. 本地存储：emptydir/hostpath...
2. 网络存储：in-tree: awsElasticBlockStroe/gcePersistentDisk/nfs ...
3. Projected Volume: secret/configmap/downwardAPI/serviceAccountToken
4. PVC与PV体系
  * Persistent Volume
  Pod中声明volume的生命周期与Pod相同：1. Pod销毁重建，Deployment管理的Pod镜像升级 2. 宿主机故障迁移，（StatefulSet管理的Pod带远程volume迁移）3. 多Pod共享同一个数据volume 4.数据volume snapshot，resize等功能的扩展实现
  * Persistent Volume Claim
  > 将存储与计算分离，使用不同的组件Controllers管理存储与计算资源，解耦 Pod与Volume的生命周期关联
  1. pv与pvc，职责分离，PVC中只用声明自己需要的存储size、access mode（单node独占还是多node共享？只读还是读写访问？），PV和其对应的后端存储信息则由交给cluster admin统一运维和管控，安全访问策略更容易控制
  2. PVC简化了User对存储的需求，PV才是存储的实际信息的承载体。通过kube-controller-manager中的PersistentVolumeController将PVC与合适的PV bound到一起，从而满足User对存储的实际需求。
* StorageClass：创建PV的模版，而 k8s 会结合 PVC 和 SC（StorageClass） 两者的信息动态创建 PV 对象

##### Pod 远程调试
> 进入一个正在运行的 Pod
`kubectl exec -it [pod-name] /bin/bash`
> 进入一个正在运行包含多容器的 Pod, -c 具体指定要进入的 container
`kubectl exec -it [pod-name] -c [container-name] /bin/bash`

##### Service 远程调试
* 当集群中应用依赖的应用需要本地调试时：
  使用 Telepresence 将本地的应用代理到集群中的一个 Service 上。
  `Telepresence --swap-deployment $DEPLOYMENT_NAME`
* 当本地开发的应用需要调用集群中的服务时：
  使用 Port-Forward 将远程应用代理到本地端口上，便可以访问curl localhost:8080
  `kubectl port-forward  [svc/app:pod.name] -n [namespace] 8080:80`


##### k8s 服务发现
* **集群内访问 Service**
$ kubectl get svc
$ curl [CLUSTER-IP]:[PORT]
$ curl [service.name]:[port]
* Headless Service
  spec.clusterIP: None(让service不再通过虚拟IP来负载均衡)
  $ curl [service.name]:[port] 而是通过DNS直接解析到多个后端IP来访问

* **向集群外暴漏 Service**
  Service类型
  1. ClusterIP
  2. ExternalName
    > 向外暴露服务
  3. NodePort
  4. LoadBalance
  ** 集群外访问 --> LoadBalancer（SLB）49.231.23.89:80 [所有Node级别]--> NodePort 宿主机的IP:32080 [宿主机Node级别] --> ClusterIP 172.29.3.27:80 [ServicePod级别] --> port为ServicePod的targetPort的所有pod xx.xx.xx.x:9376,xx...x.:9376[Pod级别]

  $ kubectl get pod -o wide [查看ip] -l run=nginx [筛选label]
  $ kubectl exec -it [podName] sh  # 进入某个Pod内部
  $ curl [svc.ip] 或 wget [svc.ip] | [env.KUBERNETES_SERVICE_HOST] # 通过svcIp来访问其他Pod
  
  ** 外部访问 直接浏览器访问 svc.type为LoadBalancer的External-IP


  #### 容器：一个linux进程
  * 空间隔离 namespace：
    1. mount 文件系统，只看到镜像提供的，看不到宿主机上的文件系统
    2. uts 隔离 hostname daemonname
    3. pid 保证容器的net进程是 1 号进程 $ ps -ef
    4. network
    5. user
    6. ipc  进程通信
    7. cgroup
  * 资源隔离 cgroup：
    2种 cgroup 驱动
    1. systemd cgroup driver
    2. cgroupfs cgroup driver
    容器中常用的 cgroup：
    1. cpu cpuset cpuacct
    2. memory
    3. device
    4. freezer
    5. blkio
    6. pid
  

##### Kubernetes 调度过程
> 把Pod 放到合适的 Node上
* 资源调度 - 满足 Pod 资源要求
  Resources：CPU/Memory/Storage/GPU/FGPA
      spec.container.resources.[requests|limits].[cpu|memory]
  Qos：Guaranteed/Burstable/BestEffort：为不同业务特点配置不同Qos
      Quality of Service: .status.qosClass: 
        1. Guaranteed(CPU/Memory request必须等于limit) -敏感型、需要保障业务
        2. Burstable(request和limit不相等) -次敏感型、需要弹性业务
        3. BestEffort(所有资源request/limit必须都不相等)  -可容忍型业务
  Resource Quota：满足资源要求，限制每个Namespace资源用量，防止过度使用
      ```
      apiVersion: v1
      kind: ResourceQuota
      metadata:
        name: demo-quota
        namespace: demo-ns
      spec:
        hard:
          cpu: '1000'
          memory: 200Gi
          pods: 10
        scopeSelector:
          matchExpressions:
          - operator: Exists
            scopeName: NotBestEffort
      限制demo-ns Namespace下非BestEffort Qos的Quota：cpu只能1000个...
      ```
      

* 关系调度 - 满足Pod/Node的特殊关系/条件要求
  PodAffinity/PodAntiAffinity: Pod和Pod间关系
    1. 必须和某些Pod调度到一起
        spec.affinity.podAffinity.requiredDuringSchedulingIgnoreDuringExecution
        ```
        spec:
          affinity:
            podAffinity[podAntiAffinity]: # 亲和调度、反亲和调度
              requiredDuringSchedulingIgnoredDuringExecution  [preferredDuringSchedulingIgnoredDuringExecution]:  # 必须和某些pod调度到一起、优先
              - labelSelector:
                matchExpressions:
                - key: k1
                  operator: [In|NotIn|Exists|DoesNotExist]
                  values:
                  - v1
        ```
  NodeSelector/NodeAffinity: 由Pod决定适合自己的Node
    1. NodeSelector
      ```
      spec:
        containers:
        nodeSelector: # 强制调度到 k1=v1的node上
          k1: v1
      ```
    2. NodeAffinity
      ```
      spec:
        affinity:...（同pod）
      ```
  Taint/Tolerations：限制调度到某些Node
    1. Taint
      ```
      apiVersion: v1
      kind: Node
      metadata:
        name: demo-node
      spec:
        taints:
        - key: 'k1'
          value: 'v1'
          effect: [noSchedule|preferNoSchedulr|NoExecure]
          # noSchedule 禁止新Pods调度上来
          # preferNoSchedule 尽量不调度到这台
          # NoExecute 会evict没有对应toleration的pods，且不会调度新的上来
      ```
      ```
      kind: Pod
      spec:
        containers:
        tolerations:
        - key: 'k1'
          operator: 'Equal' # Exists 表示key相同即可，不管value
          value: 'v1'
          effect: 'NoSchedule' # 取值与node的一样，可以为空 匹配所有
      ```
  * PriorityClass 资源不足时，优先级调度配置
    ```
    apiVersion: apis/v1
    kind: PriorityClass
    metadata:
      name: high
    value: 10000
    globalDefault: false
    ```
    ```
    # 为 Pod 配置不同优先级的 priorityClassName
    kind: Pod
    spec:
      priorityClassName: high
    ```






