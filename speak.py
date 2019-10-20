# -*- coding: utf-8 -*-
from aip import AipSpeech
""" 你的 APPID AK SK """
APP_ID = '16101699'
API_KEY = 'GFmtmKsuE06sHd17Dt9Nih2Y'
SECRET_KEY = 'aFghUNrVQYSgw4eT584NB4KQGlkqDG9Z'
client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)

from pydub import AudioSegment

import json
import urllib2

api_url = "http://openapi.tuling123.com/openapi/api/v2"


req = {
    "perception":
    {
        "inputText":
        {
            "text": ""
        },

        "selfInfo":
        {
            "location":
            {
                "city": "深圳",
                "province": "广东",
                "street": "南光路"
            }
        }
    },

    "userInfo": 
    {
        "apiKey": "1b9e365c50d2496f99c41ae3f5f71c50",
        "userId": "OnlyUseAlphabet"
    }
}

import wave
from pyaudio import PyAudio,paInt16
import json
import base64
import os
import requests
import time


RATE = "16000"
FORMAT = "wav"
CUID="wate_play"
DEV_PID="1536"

framerate=16000
NUM_SAMPLES=2000
channels=1
sampwidth=2
TIME=2

# 读取文件
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()

def save_wave_file(filename,data):
    '''save the date to the wavfile'''
    wf=wave.open(filename,'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(sampwidth)
    wf.setframerate(framerate)
    wf.writeframes(b"".join(data))
    wf.close()

def my_record():
    pa=PyAudio()
    stream=pa.open(format = paInt16,channels=1,
                   rate=framerate,input=True,
                   frames_per_buffer=NUM_SAMPLES)
    my_buf=[]
    count=0
    
    while count<TIME*16:
        string_audio_data = stream.read(NUM_SAMPLES)
        my_buf.append(string_audio_data)
        count+=1

    save_wave_file('01.wav',my_buf)
    stream.close()
    
chunk=2014
def play():
    wf=wave.open(r"02.wav",'rb')
    p=PyAudio()
    stream=p.open(format=p.get_format_from_width(wf.getsampwidth()),channels=
    wf.getnchannels(),rate=wf.getframerate(),output=True)
    while True:
        data=wf.readframes(chunk)
        if data=="":break
        stream.write(data)
    stream.close()
    p.terminate()

def trans_mp3_to_wav(filepath):
    song = AudioSegment.from_mp3(filepath)
    song.export("02.wav", format="wav")

if __name__ == '__main__':
    while True:
        print('Start!')
        my_record()
        print('Over!')
        li=client.asr(get_file_content('01.wav'), 'wav', 16000, {'dev_pid': 1536,})
        print(li)
        if li[u'err_no']==0:
            print(type(li[u'result']))
            print("".join(li[u'result']))
            req["perception"]["inputText"]["text"]="".join(li[u'result'])
            reqjson=json.dumps(req)
            
            http_post = urllib2.Request(api_url, data=reqjson, headers={'content-type': 'application/json'})
            response = urllib2.urlopen(http_post)
            response_str = response.read().decode('utf8')
            #print(response_str)
            response_dic = json.loads(response_str)
            #print(response_dic)
            
            intent_code = response_dic['intent']['code']
            results_text = response_dic['results'][0]['values']['text']
            print('Turing的回答：')
            print('code：' + str(intent_code))
            print('text：' + results_text.encode('utf8'))
            
            result  = client.synthesis(results_text, 'zh', 1, {'vol': 5,})
            
            if not isinstance(result, dict):
                with open('02.mp3', 'wb') as f:
                    f.write(result)
            else:print(result)
            
            trans_mp3_to_wav('02.mp3')
            play()
        


