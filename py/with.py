class Testwith():
  def __enter__(self):    # 1.类似声明周期，__enter__ 第一步，__exit__ 最后一步
    print('run')
  def __exit__(self, exc_type, exc_val, exc_tb): # exc_tb 异常
    if exc_tb is None:
      print('exit')
    else:
      print('has error %s' %exc_tb)
  
with Testwith():
  print('Test is runing')
  raise NameError('testNameError')
    