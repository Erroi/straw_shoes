/**
 * 通过双向广度优先搜索，查找两人之间最短通路的长度
 * user_nodes用户结点；user_id_a用户a的ID；user_id_b用户b的ID
 */
public static int bi_bfs(Node[] user_nodes, int user_id_a, int user_id_b) {
  if (user_id_a > user_nodes.length || user_id_b > user_nodes.length) return -1;
  if (user_id_a == user_id_b) return 0;
  Queue<Integer> queue_a = new LinkedList<Integer>(); // 队列a，用于从用户a出发的广度优先搜索
  Queue<Integer> queue_b = new LinkedList<Integer>(); // 队列b，用于从用户b出发的广度优先搜索

  queue_a.offer(user_id_a); // 放入初始结点
  HashSet<Integer> visited_a = new HashSet<>(); // 存放已经被访问过的结点，防止回路
  visited_a.add(user_id_a);

  queue_b.offer(user_id_b);
  HashSet<Integer> visited_b = new HashSet<>();
  visited_b.add(user_id_b);

  // 各自从两个方向出发，每次广度优先搜索一度，并查找是不是存在重叠好友
  int degree_a = 0, degree_b = 0, max_degree = 20;  // max_degree 防止两者之前不存在通路的情况
  while ((degree_a + degree_b) < max_degree) {
    degree_a ++;
    // 沿着a出发的方向，继续广度优先搜索degree + 1的好友
    getNextDegreeFriend(user_id_a, user_nodes, queue_a, visited_a, degree_a);
    // 判断到目前为止，被发现的a的好友，和被发现的b的好友，两个集合是否存在交集
    if (hasOverlap(visited_a, visited_b)) return (degree_a + degree_b);

    degree_b ++;
    getNextDegreeFriend(user_id_b, user_nodes, queue_b, visited_b, degree_b);
    if (hasOverlap(visited_b, visited_b)) return (degree_a + degree_b);
  }

  return -1;
}