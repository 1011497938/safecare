import bluetooth 
import os	#Python的标准库中的os模块包含普遍的操作系统功能
import re	#引入正则表达式对象
import urllib	#用于对URL进行编解码
from http.server import BaseHTTPRequestHandler, HTTPServer
import traceback 
from urllib.parse import urlparse
import threading
import json
import time

target_name = "HC-06"
target_address = None

nearby_devices = bluetooth.discover_devices()

for bdaddr in nearby_devices:
    if target_name == bluetooth.lookup_name( bdaddr ):
        target_address = bdaddr
        print(target_name, target_address)
        break

port = 1

sock=bluetooth.BluetoothSocket( bluetooth.RFCOMM )
sock.connect((target_address, port))

a = [0,0,0]
w = [0,0,0]
angle = [0,0,0]
T = 0

def loadData():
    global T,a,w,angle
    while True:
        Re_buf = sock.recv(1024)
        try:
            if Re_buf[0] == 0x55:
            # print(Re_buf)
                head = Re_buf[1]
                # print('%#x'%head)
                T = (Re_buf [9]<<8| Re_buf [8])/340.0+36.25
                if head==0x51:
                    #加速度计算
                    a[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*16
                    a[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*16
                    a[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*16
                    pass
                elif head==0x52:
                    #角速度
                    w[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*2000
                    w[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*2000
                    w[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*2000
                    pass
                elif head==0x53:
                    #角度
                    angle[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*180
                    angle[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*180
                    angle[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*180
                # else:
                #     print('出错啦', head, Re_buf)
                # print(a,w,angle, T)
        except:
            # traceback.print_exc()
            pass
    sock.close()


t = threading.Thread(target=loadData, args=())
t.start()

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    # GET
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','http')
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Credentials','true')
        self.send_header('Access-Control-Allow-Methods','GET,POST,PUT,POST')
        self.end_headers()
        
        responses = json.dumps({
            'a': a,
            'w': w,
            'angle': angle,
            'T': T,
            'time': time.time()
        })
        print('被获得了', time.time(), responses)
        self.wfile.write(responses.encode())

def run():
    port = 8000
    print('starting server, port', port)

    # Server settings
    server_address = ('', port)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('running server...')
    httpd.serve_forever()

run()