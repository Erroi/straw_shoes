##### Pod 生命周期：pod.status.phase
> pod的当前状态：
* pod.status.phase
1. Pending
    Pod的yaml文件已经提交，API对象已保存在Etcd中，但是，这个Pod中有些容器因为某些原因不能被顺利创建，如调度不成功。
2. Running
    Pod已经调度成功，跟一个具体的节点绑定。所包含的容器都已经创建成功，至少又一个正在运行
3. Succeeded
    Pod所有容器正常运行完毕，且已经退出了。（一次性任务最常见）
4. Failed
    Pod里至少有一个容器以不正常状态退出。
5. Unknow
    异常状态，意味着 Pod 的状态不能持续的被kubelete汇报给kube-apiserver，（主从节点通信问题）
> 还有更细分的 Condition,来描述status产生的原因
* Pod.Condition
1. PodScheduled
2. Ready
    Pod不仅已经正常启动Running，而且已经对外提供服务了
3. Initialized
4. Unschedulable

设计原理：
1. 只要 Pod 的 restartPolicy 指定的策略允许重启异常的容器（比如：Always），那么这个 Pod 就会保持 Running 状态，并进行容器重启。否则，Pod 就会进入 Failed 状态
2. 对于包含多个容器的 Pod，只有它里面所有的容器都进入异常状态后，Pod 才会进入 Failed 状态。在此

> Pod 其他
* Pod.spec.shareProcessNamespace: true
  意味着Pod里的容器要共享 PID Namespace。
  `$ kubectl attach -it nginx-name -c shell` 连接到shell容器的tty上
  `# ps ax`   查看所有运行的进程，不仅有ps ax指令的，还可以看到nginx容器进程的。

* Pod.spec.hostNetwork: true
* Pod.spec.hostIPC: true
* POd.spec.hostPID: true
  意味着，这个pod里的所有容器，会直接使用宿主机的网络、直接与宿主机进行IPC通信、看到宿主机里正在运行的所有进程

##### Projected Volume
> 为容器提供预先定义好的数据，“投射进容器中”
* Secret
  将Pod想要访问的加密数据放到 Etcd 中，Pod的容器可以挂载Volume 来访问这些Secret
* ConfigMap
* Downward API
  让Pod里的容器能够直接获取到这个 Pod API对象本身的信息
  `kubectl create configmap ui-config --from-file=ui.properties`
* ServiceAccountToken
  权限分配的对象，任何运行在k8s集群上的应用，都必须使用这个ServiceAccountToken里保存的授权信息TOKEN，访问和操作API
  Kubernetes 其实在每个 Pod 创建的时候，自动在它的 spec.volumes 部分添加上了默认 ServiceAccountToken 的定义，然后自动给每个容器加上了对应的 volumeMounts 字段,容器里的应用就可以直接从这个默认 ServiceAccountToken 的挂载目录里访问到授权信息和文件
  `ls /var/run/secrets/kubernetes.io/serviceaccount `

##### replicaSet
> ReplicaSet 负责通过“控制器模式”，保证系统中 Pod 的个数永远等于指定的个数（比如，3 个）。这也正是 Deployment 只允许容器的 restartPolicy=Always 的主要原因：只有在容器能保证自己始终是 Running 状态的前提下，ReplicaSet 调整 Pod 的个数才有意义. 而在此基础上，Deployment 同样通过“控制器模式”，来操作 ReplicaSet 的个数和属性，进而实现“水平扩展 / 收缩”和“滚动更新”这两个编排动作。
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1   # 除了 DESIRED 数量之外，在一次“滚动”中，Deployment 控制器还可以创建多少个新 Pod
    maxUnavailable: 1   #Deployment 控制器可以删除多少个旧 Pod

`kubectl create -f nginx-deployment.yaml --record`
`kubectl scale deployment nginx-deployment --replicas=4`
`kubectl get deployments`
  * DESIRED：用户期望的 Pod 副本个数（spec.replicas 的值）；
  * CURRENT：当前处于 Running 状态的 Pod 的个数；
  * UP-TO-DATE：当前处于最新版本的 Pod 的个数，所谓最新版本指的是 Pod 的 Spec 部分与 Deployment 里 Pod 模板里定义的完全一致；
  * AVAILABLE：当前已经可用的 Pod 的个数，即：既是 Running 状态，又是最新版本，并且已经处于 Ready（健康检查正确）状态的 Pod 的个数。
`kubectl rollout status deployment/nginx-deployment`
`kubectl get rs`
`kubectl edit deployment/nginx-deployment`  # 修改完便会触发滚动更新
`kubectl describe deployment nginx-deployment` # 查看Events，滚动流程
`kubectl set image deployment/nginx-deployment nginx=nginx:1.91`
`kubectl rollout undo deployment/nginx-deployment` # 回滚
`kubectl rollout history deployment/nginx-deployment`
`kubectl rollout history deployment/nginx-deployment --reversion=2`
`kubectl rollout undo deployment/nginx-deployment --to-revision=2`
`kubectl rollout pause deployment/nginx-deployment`
`kubectl rollout resume deployment/nginx-deployment`


##### StatefulSet
> StatefulSet 这个控制器的主要作用之一，就是使用 Pod 模板创建 Pod 的时候，对它们进行编号，并且按照编号顺序逐一完成创建工作。而当 StatefulSet 的“控制循环”发现 Pod 的“实际状态”与“期望状态”不一致，需要新建或者删除 Pod 进行“调谐”的时候，它会严格按照这些 Pod 编号的顺序，逐一完成这些操作。
Headless Service 指clusterIP: None
`<pod-name>.<svc-name>.<namespace>.svc.cluster.local`
`kubectl get pods -w -l app=nginx`
`kubectl exec web-0 -- sh -c 'hostname'`
`kubectl get pod -w -l app=nginx`
`kubectl patch statefulset mysql -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'`


##### DaemonSet
> 需求：这个 Pod 运行在 Kubernetes 集群里的每一个节点（Node）上；每个节点上只有一个这样的 Pod 实例；当有新的节点加入 Kubernetes 集群后，该 Pod 会自动地在新节点上被创建出来；而当旧节点被删除后，它上面的 Pod 也相应地会被回收掉。
> DaemonSet 其实是一个非常简单的控制器。在它的控制循环中，只需要遍历所有节点，然后根据节点上是否有被管理 Pod 的情况，来决定是否要创建或者删除一个 Pod。
> 在创建每个 Pod 的时候，DaemonSet 会自动给这个 Pod 加上一个 nodeAffinity，从而保证这个 Pod 只会在指定节点上启动。同时，它还会自动给这个 Pod 加上一个 Toleration，从而忽略节点的 unschedulable“污点”。
`Docker 容器里应用的日志，默认会保存在宿主机的 /var/lib/docker/containers/{{. 容器 ID}}/{{. 容器 ID}}-json.log 文件里`
`kubectl get ds -n kube-system fluentd-elasticsearch`
`kubectl rollout history daemonset fluentd-elasticsearch -n kube-system`
`kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=k8s.gcr.io/fluentd-elasticsearch:v2.2.0 --record -n=kube-system`
`kubectl rollout status ds/fluentd-elasticsearch -n kube-system`
`kubectl rollout history daemonset fluentd-elasticsearch -n kube-system`
`kubectl rollout undo daemonset fluentd-elasticsearch --to-revision=1 -n kube-syste`
* ControllerRevision
`kubectl get controllerrevision -n kube-system`

##### Job
> 离线业务，计算业务：在计算完成后就会退出，不需要在重启。
> 这个 Job 对象在创建后，它的 Pod 模板，被自动加上了一个 controller-uid=< 一个随机字符串 > 这样的 Label。而这个 Job 对象本身，则被自动加上了这个 Label 对应的 Selector，从而 保证了 Job 与它所管理的 Pod 之间的匹配关系
> restartPolicy=Never 的原因：离线计算的 Pod 永远都不应该被重启，否则它们会再重新计算一遍
> restartPolicy 在 Job 对象里只允许被设置为 Never 和 OnFailure；而在 Deployment 对象里，restartPolicy 则只允许被设置为 Always
`kubectl logs [pod:pi-68dd7]`
> 定义的 restartPolicy=OnFailure，那么离线作业失败后，Job Controller 就不会去尝试创建新的 Pod。但是，它会不断地尝试重启 Pod 里的容器
> 我们就在 Job 对象的 spec.backoffLimit 字段里定义了重试次数为 4
> spec.activeDeadlineSeconds 字段可以设置最长运行时间
> spec.parallelism，它定义的是一个 Job 在任意时间最多可以启动多少个 Pod 同时运行;
> spec.completions，它定义的是 Job 至少要完成的 Pod 数目，即 Job 的最小完成数。
* CronJob
> CronJob 是一个 Job 对象的控制器Controller
> 它创建和删除 Job 的依据，是 schedule 字段定义的、一个标准的Unix Cron格式的表达式
> concurrencyPolicy=Allow，这也是默认情况，这意味着这些 Job 可以同时存在；concurrencyPolicy=Forbid，这意味着不会创建新的 Pod，该创建周期被跳过；concurrencyPolicy=Replace，这意味着新产生的 Job 会替换旧的、没有执行完的 Job。而如果某一次 Job 创建失败，这次创建就会被标记为“miss”。当在指定的时间窗口内，miss 的数目达到 100 时，那么 CronJob 会停止再创建这个 Job。

* 命令式配置文件操作
`kubectl create -f xx.yaml`
`kubectl update -f xx.yaml`
* 声明式API
`kubectl apply -f xx.yaml` # 是对原API对象的PATCH操作，具有merge能力


##### RBAC 基于角色的权限控制
> 负责完成授权（Authorization）工作的机制: Kubernetes中的所有API对象，都保存在 Etcd 里。而 对这些API对象的操作，却一定要通过 kube-apiserver实现，重要的原因就是 需要APIServer做授权工作
> RBAC 体系的核心：
**Namespace级别**
1. Role: 角色，一组规则：定义了一组对 Kubernetes API对象的操作权限
2. Subject：被作用者，
3. RoleBinding: 定义了“被作用者”和“角色”的绑定关系
**cluster级别**
4. ClusterRole
5. ClusterRoleBinding

```
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: mynamespace
  name: example-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  # resourceNames: ["my-config"]
  verbs: ["get", "watch", "list"] 
  # verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```
```
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: example-rolebinding
  namespace: mynamespace
subjects:  # subject就是“被作用者”
- kind: User (ServiceAccount、)
  name: example-user
  apiGroup: rbac.authorization.k8s.io
roleRef:  # 角色
  kind: Role
  name: example-role
  apiGroup: rbac.authorization.k8s.io
```
`kubectl get sa`
`kubectl get clusterroles`
`kubectl describe clusterrole system:kube-scheduler`
``


##### Operator
> Operator 的工作原理，实际上是利用了 Kubernetes 的自定义 API 资源（CRD），来描述我们想要部署的“有状态应用”；然后在自定义控制器里，根据自定义 API 对象的变化，来完成具体的部署和运维工作。


##### 网络
```
# 在宿主机上执行
设置，你就可以在 /var/log/syslog 里看到数据包传输的日志
$ iptables -t raw -A OUTPUT -p icmp -j TRACE
$ iptables -t raw -A PREROUTING -p icmp -j TRACE
```

**被service 的 selector 选中的 Pod，就称为 Service 的 Endpoints**
`kubectl get endpoints`  # 只有处于Running状态，且readinessProbe检查通过的Pod，才会出现在Service的Endpoints列表里
`curl 10.10.1.175:80`  # 可通过 Service的VIP访问Pod

###### Ingress
> Ingress 对象，其实就是 Kubernetes 项目对‘反向代理’的一种抽象。
> 需求来源：由于每个 Service 都要有一个负载均衡服务，会即浪费。而更希望看到 Kubernetes 能够内置一个全局的负载均衡器，可以通过我访问的URL，把请求转发给不同的后端Service。
> 这种全局的、为了代理不同后端 Service 而设置的负载均衡服务，就是 Kubernetes 里的 Ingress 服务。
> Ingress Controller 也允许你通过 Pod 启动命令里的–default-backend-service 参数，设置一条默认规则，比如：–default-backend-service=nginx-default-backend
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: cafe-ingress
spec:
  tls:
  - hosts:
    - cafe.example.com
    secretName: cafe-secret
  rules:
  - host: cafe.example.com
    http:
      paths:
      - path: /tea
        backend:
          serviceName: tea-svc
          servicePort: 80
      - path: /coffee
        backend:
          serviceName: coffee-svc
          servicePort: 80
```

使用 kubectl attach 命令，连接到 shell 容器的 tty 上，查看进程
`kubectl attach -it nginx -c shell`
`ps ax`