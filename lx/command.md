* cat xxx.txt 
* tail -n xxx.txt
* head xxx.txt  -f 追踪
* head
* tail
* wc

* ls -rlt
* cp -p  -v
* mv 
* 

# stat filea 展示文件信息

* tar cf /tmp/etc-backup.tar  /etc  将etc目录打包为 /tmp/etc-backup.tar    cf 打包成文件，cfz 打包并压缩成文件
  (c 打包， x 解包， f 指定操作类型为文件)

* tar xf /tmp/etc-backup.tar.gz -C /root  解压缩到/root命令

* vim
  「yy」 复制     [p] 粘贴
   「dd」剪切 d$  [p] 粘贴
    [u] 撤销      [control + R] 回撤
    [x] 删除当前字符 
    [r] 替换字符
    [:set nu] 显示行
    [:set nonu] 不显示行号
    [g] 移至首行   [G] 移至尾行
    [shift + ^] 移至行首   [shift + $] 移至行未
    [:!config]
    [/abcde] 查找 abcde    n选中下个    shift + n选中上个   [:set nohlsearch] 取出选中高亮
    [:%s/d/D/g] 全局替换 d 为 D
    [:3,5s/a/A/g] 3到5行 替换

    ctrl + v 进入可视模式 块操作 上下移动选中块，d 删除、shift + i 插入  双击ecs 使每行都会插入

* 用户 
  ‘#' 表示root权限
  # useradd wilson  创建了用户 wilson 
  # id wilson       切换为 wilson
  /home/wilson
  /root
  # passwd wilson
  # passwd          更改密码
  # userdel -r wilson 删除
  # su - user1 临时切换用户
  sudo 以其他用户以管理员身份执行命令 visudo

  * 网络管理
  1. net-tools
    # ifconfig
    # route -n 查看网关
    root
    # netstat
  2. iproute2
    # ip
    # ss

  3. 故障排除
   # ping
   # traceroute -w 1 www.baidu.com
   # mtr  详细分析
   # nslookup www.baidu.com 查看域名对应ip
   # telnet www.baidu.com 80 诊断端口
   # tcpdump  -i any -n port 80 抓数据包 -w /root/file   host 10.0.0.1 and port 80
   # netstat  服务的监听地址 -ntpl
   # ss -ntpl 服务器的监听情况

  reboot 重启

  4. 网络服务管理程序 SysV和systemd
  # service network start|stop|restart|status
  # chkconfig --list  (network
  centOs 7才有 systemctl
  # systemctl list-unit-files  NetworkManager.service
  # systemctl start|stop|restart|enable(随开机) NetworkManger
  # systemctl enable|disable NetworkManager
  网卡的配置文件: ifcfg-eth0
  网络的常用参数：/etc/hosts
  弹性网卡的配置文件：/etc/sysconfig/network-scripts/ifcfg-*
    /ifcfg-
     BOOTPROTO=dhcp 动态 none静态
     IPADDR=10.xx.xx.xx  静态时设置ip
     NETMASK=255.255.255.0 子网掩码
     GATEWAY=10.211.55.1   网关
     DNS1=114.114.114.114  DNS

  # hostname 主机名
  # hostname [set-hostname] xxxx 永久设置主机名


  5. 包管理器
   CentOS  RedHat 使用yum包管理器，软件安装包格式 rpm
   Debian  Ubuntu 使用 apt 包管理器，软件安装格式为 deb

   # rpm -q 查询 -i 安装 -e 卸载  rpm -qa | more
   yum包管理器 安装解决rpm的依赖关系
   # yum install|remove| list|grouplist| update

   # yum search [package]

   rpm 格式内核
   uname -a 查看内核版本
   yum install kernel-3.10.0 升级内核版本
   yum update 升级其他软件包和补丁
   cat /etc/centos-release  查看centos版本
   lscpu 查看cpu

   6. grub 引导软件
   配置文件
   /etc/default/grub
   /etc/grub.d/
   /boot/grub2/grub.cfg

   # mount 挂载

   7. 进程：运行中的程序，从程序开始运行到终止的整个生命周期是可管理的
   进程查看
   # ps     -efL | more  (管道符 more 分页, L 线程)
   # pstree
   # top  查看进程资源 -p 20923
      调整优先级
      # nice -n -20 到 19，值越小优先级越高，抢占资源就越多
      renice 重新设置优先级
      进程的作业控制
      job
      # ./a.sh &  (& 符号 在后台运行进程)
      # fg 1      (将进程调回到前台)
      # bg 1      (掉入后台) 
      # ctrl + z  (将程序掉入后台)  

  8. 信号： 进程间通信方式之一，（终端用户通过中断命令，信号机制停止一个程序的运行
    # kill -l
      ctrl + c 通知前台终止进程
      kill -9 pid 立即结束程序，不能被阻塞

  9. 守护进程 daemon（随终端一起启动）
  deamon进程 sshd
  # ps -ef | grep sshd
  
  # nohup tail -f /var/log/messages &   (关掉终端后仍保留进程)

  9. 日志
  # tail -f /var/log/messages
  # tail -f /var/log/dmesg  内核相关运行信息
  # tail -f /var/log/secure 安全日志

  10. 服务管理工具
  * service
    启动脚本： /etc/init.d/network
  systemctl

  11. 内存与磁盘管理
  * 查看内存使用率
    # free -m  -g
  * 查看磁盘
    # fdisk -l
    # df -h  挂载目录
    # ls -lh bfile 记录文件长度
    # du -h bfile 实际占用大小

  12. 文件系统 Linux支持多种文件系统
  * ext4 
    超级块 $df查看的
    超级块副本
    i节点 inode   记录文件大小 权限 $ls -i  \  $ln -s filea fileb 使节点相同
    数据块 datablock      $du
    # getfacl afile 查看afile文件权限
    # setfacl -m u:user1:r afile 设置afile的user1的r权限
  * xfs
  * NTFS

  13. 磁盘分区、挂载
  # fdisk
    fdisk /dev/sdd (创建分区)
  # mkfs
    mkfs.ext4 /dev/sdc1 （将分区映射为盘符）
  # parted
    parted /dev/sdd（磁盘大于 2T 时的分区）
  # mount
    sdc sdc1 ext4 mount /dir （将盘符进行挂载）
  配置文件 /etc/fstab

  14. 用户磁盘配额
  xfs文件系统的用户磁盘配额 quota
  # mkfs.xfs /dev/sdb1
  # mkdir /mnt/disk1
  # mount -o uquota,gquota /dev/sdb1  /mnt/disk1
  # chmod 1777 /mnt/disk1   (赋予1777 权限)
  # xfs_quota -x -c `report -ugibh` /mnt/disk1  (查看磁盘)

  15. 逻辑卷 （相对于物理卷，磁盘的扩展）

  16. 系统综合状态查询
  使用 sar 命令查看系统综合状态
  # sar -u 1 10    -u 查看cpu使用率、-q 查看平均负荷  -b 查看I/O和传送速率的统计信息
  使用第三方命令查看网络流量 
  # iftop -p


  17. Shell 命令解释器，用于解释用户对操作系统的操作
  cat /etc/shells
  CentOS7 默认使用的 Shell 是 bash
  Shell脚本（为了组合命令和多次执行，使用脚本文件来保存需要执行的命令）
  赋予该文件执行权限（chmod u+rx filename）

  bash脚本：1.sh   #!/bin/bash
  # bash ./1.sh
  # ./1.sh
  # source ./1.sh

  18. 管道符 ｜ ，将前一个命令执行的结果传递给后面的命令
   # ps | cat
   # echo 123 | ps

  19. 重定向
  # read var < /path/to/a/file  输入重定向
  # echo 123 > /path/to/a/file  输出重定向符号 >   >>    2>   &>
  # cat > /path/to/a/file << EOF
  # i am $USER
  # EOF

  20. 变量
  echo $USER
  echo $UID
  echo $PATH


  21. 元字符
  .  *  [] ^ $ \
  # grep    文本的查找 grep pass.* /root/filea
  # find passwd 
  # find /etc -name passwd 查找文件名为passwd在哪些目录
  # find /etc -regex .*wd
  # find /etc -type f -regex .*wd
  # find *txt -exec rm -v {} \;     (-exec 删除文件不提示 -ok删除时提示)


  22. 服务管理
  防火墙：软件防火墙（数据包过滤，是否允许IP进入主机）、硬件防火墙（防御DOS攻击）
  软件防火墙：包过滤（IP 端口）和应用层（控制用户访问事件
  CentOS6 默认的防火墙是 iptables
  CentOS7 默认的防火墙是 firewallD（底层使用netfile）
  iptables的表和链: 规则表（filter nat mangle raw）规则链（INPUT  OUTPUT FORWARD PREROUTING POSTROUTING）
  iptables 的 filter 表
  # iptables -t filter -L
  # iptables -t filter -A/-I INPUT -s 10.0.0.1 -j ACCEPT  (A 追加，I 插入首个)
  # iptables -vnL
  # iptables -P INPUT DROP 改写默认规则，阻挡所有访问
  # iptables -P INPUT ACCEPT
  # iptables -F 清除自己添加的规则
  # iptables -D 

  iptables 的 nat 表
  # iptables -t nat 命令 规则链 规则
  PREROUTING 目的地址转换
  POSTROUTING 源地址转换
  # iptables -t nat -A PREROUTING -i eth0 -d 114.115.116.117 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.1
  # iptables -t nat -A PREROUTING -i eth0 -d 114.115.116.117 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.1
  # iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth1 -j SNAT --to-source 111.112.113.114
  iptables 配置文件 /etc/sysconfig/iptables
  firewallD 服务
    支持区域 zone 的概念
    firewall-cmd
  systemctl start | stop | enable | disable firewalld.service
  # firewall-cmd --list-all
  # firewall-cmd --add-service ftp

  23. SSH 服务：远程管理
    配置文件： /etc/ssh/sshd_config
    telnet 服务

  # tcpdump -i any port 23 -s 1500 -w /root/a.dump 抓包

  # ssh-keygen -t rsa 生成私钥至 /root/.ssh/id_rsa
  # ssh-copy-id -i /root/.ssh/id_rsa.pub root@xxxxx  将公要拷贝至服务器

  # scp ./filea root@xxx:/tmp/ 将本地文件考到远程
  # scp root@10.211.55.3:/root/kpi.txt  /tmp/k.txt    远程文件拷到本地

  24. ftp协议（文件传输）限制登录文件读写
  主动模式和被动模式
    vsftpd 服务器安装
  # service vsftpd start
  # ftp localhost
  # ls  (!ls查看本地文件)
  # put a.txt   上传
  # get a.txt   下载
  /var/ftp
  vsftpd 服务配置文件
    /etc/vsftpd/vsftpd.conf  主配置 
    /etc/vsftpd/ftpusers     不允许登录的用户（黑名单）
    /etc/vsftpd/user_list     （黑/白名单）

  25. samba 服务
  26. NFS 服务：Linux之间的文件共享服务，通过挂载访问远程共享文件
  配置文件 /etc/exports   /data/share*(rw,sync,all_squash)
  showmount -e localhost
  客户端使用挂载方式访问
  # mount -t nfs localhost:/data/share/ent
  启动 NFS 服务
  # systemctl start|stop nfs.service

  27. Nginx (engine X：是一个高性能的web和反向代理服务器)
  Nginx支持HTTP、HTTPS 和 电子邮件代理协议
  OpenResty 是基于 Nginx 和 Lua实现的Web应用网关，集成了大量的第三方模块
  # yum-config-manager --add-repo https://openresty.org/package/centos/openresty.repo
  # yum install openresty
  /usr/local/openresty/nginx/conf/nginx.conf
  # service openresty start|stop|restart|reload
  OpenResty 配置域名虚拟主机

  28. LNMP(Linux + Apache-> Nginx + PHP + MySQL)
  MySQL安装（可以使用mariadb替代）
    # yum install mariadb mariadb-server
    character_set_server=utf8
    init_connect=`SET NAMES utf8`
    # systemctl start mariadb.service
    # show variables like '%character_set%'
  PHP安装
    # yum install php-fpm php-mysql
    # systemctl start php-fpm.service
  Nginx
    location ~\.php$ {
      root html;
      fastcgi_pass 127.0.0.1:9000;
      fastcgi_index index.php;
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      include fastcgi_params;
    }

  29. DNS服务
  DNS(Domain Name System) 域名系统
  FQDN（Full Qualified Domain Name）完全限定域名
  域分类：根域、顶级域（TLD）
  DNS服务类型： 缓存域名服务器、主域名服务器、从域名服务器
  /etc/hosts
  # yum install bind bind-utils
  # systemctl start named.service
  /etc/named.conf

  30. NAS(Network Attached Storage) 网络附属存储
  NAS支持的协议 NFS、CIFS、FTP




