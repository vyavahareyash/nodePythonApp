# print('Hello from python')
import sys
import json, requests
# print(sys.argv)
ans=requests.post("https://yashvyavahare.ap-south-1.modelbit.com/v1/example_doubler/latest",
              # headers={"Content-Type":"application/json"},
              data=json.dumps({"data": int(sys.argv[1])})).json()
print(ans['data'])