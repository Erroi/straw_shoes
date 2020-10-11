## 有了广度优先搜索，可以知道某个用户的一度、二度、三度等好友。
### ？给定两个用户，如何确定他们之间是几度好友？
### 双向广度优先搜索
##> 1. 从a出发，进行广度优先搜索，记录a的所有一度好友a1，看b是否出现在集合a1中。
##> 2. 如果没有，就搜索记录b的所有一度好友，看a是否出现在b1中。依次 a2（看b、b1是否有交集）
##> 3. 假设c在这个交集中，则a到c加b到c就是最短通路长。

import queue
## .java里的两个预留方法
  ###
  #user_nodes: 用户节点网络
  #que：某一层用户节点 即第几度好友
  #visited: 已访问的所有用户节点
  ### 如果把 user_id_a 看作圆心，它的一度好友看作第一层节点，二度好友看作第二层节点 .... ，que 队列只保留某一层的节点即可，visited 仍保存所有访问过的节点
def get_next_degree_friend(user_nodes, que, visited):
  que_return = queue.Queue() # 只保存某个用户的第几度好友
  visited_return = set() # 保存从某个用户开始到第几度好友
  while not que.empty():
    current_user_id = que.get()
    if user_nodes[current_user_id] is None:
      continue
    for friend_id in user_nodes[current_user_id].friends:
      if user_nodes[friend_id] is None:
        continue
      if friend_id in visited:
        continue
      que_return.put(friend_id)
      visited_return.add(friend_id)
  return que_return, visited_return

def has_overlap(visited_a, visited_b):
  # 两个 set的交集
  return len(visited_a & visited_b) > 0

if __name__ == "__main__":
  user_nodes_list = set_user_relation(10, 20)
  for i in range(user_nodes_list):
    print('用户 %s 的好友：%s' % (user_nodes_list[i].user_id, user_nodes_list[i].friends))
  print('----双向广度优先搜索----')
  print('两个用户节点1 和 2 之间最短路径长度：', bi_bfs(user_nodes_list, 1, 2))
  