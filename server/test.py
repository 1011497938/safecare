import bluetooth 
import os	#Python的标准库中的os模块包含普遍的操作系统功能
import re	#引入正则表达式对象
import urllib	#用于对URL进行编解码
from http.server import BaseHTTPRequestHandler, HTTPServer
import traceback 

# devices = bluetooth.discover_devices(lookup_names=True)
# for addr, name in devices:
#     print(addr, name)
#     services = bluetooth.find_service(address=addr)
#     for svc in services:
#         print("Service Name: %s"    % svc["name"])
#         print("    Host:        %s" % svc["host"])
#         print("    Description: %s" % svc["description"])
#         print("    Provided By: %s" % svc["provider"])
#         print("    Protocol:    %s" % svc["protocol"])
#         print("    channel/PSM: %s" % svc["port"])
#         print("    svc classes: %s "% svc["service-classes"])
#         print("    profiles:    %s "% svc["profiles"])
#         print("    service id:  %s "% svc["service-id"])
#         print("")
# bd_addr = "20:18:12:27:24:29"

# port = 13

# sock=bluetooth.BluetoothSocket( bluetooth.RFCOMM )
# sock.connect((bd_addr, port))

# sock.send("hello!!")

# sock.close()


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

while True:
    Re_buf = sock.recv(1024)
    try:
        if Re_buf[0] == 0x55:
        # print(Re_buf)
            head = Re_buf[1]
            # print('%#x'%head)
            if head==0x51:
                #加速度计算
                a[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*16
                a[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*16
                a[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*16
                T = (Re_buf [9]<<8| Re_buf [8])/340.0+36.25
                pass
            elif head==0x52:
                #角速度
                w[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*2000
                w[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*2000
                w[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*2000
                T = (Re_buf [9]<<8| Re_buf [8])/340.0+36.25
                pass
            elif head==0x53:
                #角度
                angle[0] = (Re_buf [3]<<8| Re_buf [2])/32768.0*180
                angle[1] = (Re_buf [5]<<8| Re_buf [4])/32768.0*180
                angle[2] = (Re_buf [7]<<8| Re_buf [6])/32768.0*180
                T = (Re_buf [9]<<8| Re_buf [8])/340.0+36.25
            # else:
            #     print('出错啦', head, Re_buf)
            print(angle)
    except:
        traceback.print_exc()

sock.close()