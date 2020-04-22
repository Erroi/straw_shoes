import threading
import time
from threading import Thread,current_thread
import random
from queue import Queue

queue = Queue(5)

def myThread(arg1, arg2):
  print(current_thread().getName(), 'start')
  print('%s %s'%(arg1, arg2))
  time.sleep(1)
  print(current_thread().getName(), 'stop')

for i in range(1,6,1):
  # t1 = myThread(i, i+1)
  t1 = threading.Thread(target=myThread, args=(i, i+1))
  t1.start()
  # t1.join() 强制按顺序

print(current_thread().getName(), 'end')

# 一个进程开多线程 并发

class ProducerThread(Thread):
  def run(self):
    name = current_thread().getName()
    nums = range(100)
    global queue
    while True:
      num = random.choice(nums)
      queue.put(num)  # 放入队列
      print('%s 生产类数据 %s' %(name, num))
      t = random.randint(1,3)
      time.sleep(t)
      print('%s 睡眠类 %s 秒' %(name, t))

class ConsumerTheard(Thread):
  def run(self):
    name = current_thread().getName()
    global queue
    while True:
      num = queue.get() # 从队列中取出
      queue.task_done() # 等待
      print('消费者 %s 小憨哦了数据 %s' %(name, num))

p1 = ProducerThread(name = 'p1')
p1.start()
c1 = ConsumerTheard(name = 'c1')
c1.start()
c2 = ConsumerTheard(name = 'c2')
c2.start()

