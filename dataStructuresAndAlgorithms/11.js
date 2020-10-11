function insertionSort(a, n) {
  if (n<= 1) return;

  for (var i = 1; i< n; ++i) {
    var value = a[i];
    var j = i - 1;
    for (; j >= 0; --j) {   // 注意这里的 --j: 表示循环后立马 j = j - 1; 除非 break掉不会执行 --j;
      if (a[j] > value) {
        a[j+1] = a[j];
        console.log('+++', a)
      } else {
        break;
      }
    }
    console.log('i:', i, '---j:', j)
    a[j+1] = value;
  }
  console.log('a', a)
}

insertionSort([4, 5,6,1,3,2], 6)

/***
i: 1 ---j: 0
i: 2 ---j: 1
+++ [ 4, 5, 6, 6, 3, 2 ]
+++ [ 4, 5, 5, 6, 3, 2 ]
+++ [ 4, 4, 5, 6, 3, 2 ]
i: 3 ---j: -1
+++ [ 1, 4, 5, 6, 6, 2 ]
+++ [ 1, 4, 5, 5, 6, 2 ]
+++ [ 1, 4, 4, 5, 6, 2 ]
i: 4 ---j: 0
+++ [ 1, 3, 4, 5, 6, 6 ]
+++ [ 1, 3, 4, 5, 5, 6 ]
+++ [ 1, 3, 4, 4, 5, 6 ]
+++ [ 1, 3, 3, 4, 5, 6 ]
i: 5 ---j: 0
a [ 1, 2, 3, 4, 5, 6 ]
 */