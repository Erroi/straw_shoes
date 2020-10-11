/**
 广度优先搜索（推荐几度好友）
 利用队列 先进先出
# 指从图中的某个结点出发，沿着和这个点相连的边向前，寻找和这个点距离为1的所有其他点，
# 当和起始点距离为1的所有点（兄弟节点）都被搜索完，才开始搜索和起始点为2的点（子节点），如此类推。
 */

public class Node {
  public int user_id;
  public HashSet<Integer> friends = null;
  public int degree;

  public Node(int id) {
    user_id = id;
    friends = new HashSet<>();
    degree = 0;
  }

  /***
    @description: 通过广度优先搜索，查找好友
    @param user_nodes-用户的结点：user_id-给定的用户ID，为此用户查找好友
    @return void
   */
  public static void bfs(Node[] user_nodes, int user_id) {
    if (user_id > user_nodes.length) return;
    // 用于广度优先搜索的队列
    Queue<Integer> queue = new LinkedList<Integer>();

    queue.offer(user_id); // 放入初始结点
    HashSet<Integer> visited = new HashSet<>();
    visited.add(user_id);

    while (!queue.isEmpty()) {
      int current_user_id = queue.poll(); // 拿出队列头部的第一个结点
      if (user_nodes[current_user_id] == null) continue;

      // 遍历刚刚拿出的这个结点的所有直接连接结点，并加入队列尾部
      for (int friend_id: user_nodes[current_user_id].friends) {
        if (user_nodes[friend_id] == null) continue;
        if (visited.contains(friend_id)) continue;
        queue.offer(friend_id);
        visited.add(friend_id);
        user_nodes[friend_id].degree = user_nodes[current_user_id].degree + 1;
        System.out.println(String.format("\t%d度好友：%d", user_nodes[friend_id].degree, friend_id));
      }

    }
  }
}
