/**
树的深度优先搜索
# 计算机最基本的数据结构是数组和链表：数组适合随机快速的访问，
# 链表表示稀疏的数列或矩阵，可以更有效的利用存储空间，也利于数据的动态插入和删除。

### 实现深度优先搜索的过程和递归调用在逻辑上是一致的。
# 虽然函数递归调用非常直观，但是在遍历的过程中，函数的每次嵌套都可能产生新的变量来保存中间结果，消耗大量内存。
# 所以可以使用更节省内存的数据结构，栈。
*/ 

// 设计一个 TreeNode 类，表示有向树的结点和边。
public class TreeNode {
  public char label;  // 结点的名称，在前缀树里是单个字母
  public HashMap<Character, TreeNode> sons = null; // 使用哈希映射存放子结点。哈希便于确认是否已经添加过某个字母对应的结点。
  public String prefix = null; // 从树的根到当前结点这条通路上，全部字母所组成的前缀。
  public String explanation = null; // 词条的解释

  // 初始化结点
  public TreeNode(char l, String pre, String exp) {
    label = l;
    prefix = pre;
    explanation = exp;
    sons = new HashMap<>();
  }

  public void dfsForm(char str, char parent) {
    char c = str.toCharArray()[0];
    TreeNode found = null;

    if (parent.sons.containsKey(c)) {
      found = parent.sons.get(c);
    } else {
      TreeNode son = new TreeNode(c, pre, '');
      parent.sons.put(c, son);
      found = son;
    }
  }

  // 使用栈来实现深度优先搜索
  public void dfsByStack(TreeNode root) {
    Stack<TreeNode> stack = new Stack<TreeNode>();
    stack.push(root);
    while(!stack.isEmpty()) {
      TreeNode node = stack.pop();
      if (node.sons.size() == 0) {
        System.out.println(node.prefix + node.label);
      } else {
        Iterator<Entry<Character, TreeNode>> iter = node.sons.entrySet().iterator();
        Stack<TreeNode> stackTemp = new Stack<TreeNode>();
        while(iter.hasNext()) {
          stackTemp.push(iter.next().getValue());
        }
        while(!stackTemp.isEmpty()) {
          stack.push(stackTemp.pop());
        }
      }
    }
  }
}
