#!/usr/bin/python3

import sys, os, re

regex_alpha = re.compile(r"[a-zA-ZäöüÄÖÜß]+")

charmap = {
  'ä': 'a',
  'ö': 'o',
  'ü': 'u',
  'ß': 'ss',
  'A': 'A',
  'Ö': 'Ö',
  'Ü': 'Ü'
}

def key_function(t):
  return "".join((charmap[c] if c in charmap else c) for c in t[0].lower())

def sift(s,n):
  return set(text for text in regex_alpha.findall(s) if len(text)>n)

def get_indexlist():
  f = open("indexlist.txt","r")
  m = sift(f.read(),1)
  f.close()
  return m

def index_append(d,text,name,path):
  if text in d:
    d[text].append([name,path])
  else:
    d[text]=[[name,path]]

def is_indexable(s):
  return s[-4:]==".htm" or s[-4:]==".txt" or s[-4:]==".tex"

def generate_index():
  a = list(os.walk("./"))
  d={}
  for t in a:
    for name in t[2]:
      if is_indexable(name):
        path = os.path.join(t[0],name)
        f = open(path,'r')
        s = f.read()
        f.close()
        for text in sift(s,2):
          index_append(d,text,name,path)
  for text,L in d.items():
    L.sort(key=lambda t: t[0].lower())
  index = list(d.items())
  index.sort(key=key_function)
  return index

def generate_index_exclusive(index_set):
  a = list(os.walk("./"))
  d={}
  for t in a:
    for name in t[2]:
      if is_indexable(name):
        path = os.path.join(t[0],name)
        f = open(path,'r')
        s = f.read()
        f.close()
        for text in index_set:
          if text in s:
            index_append(d,text,name,path)
  for text,L in d.items():
    L.sort(key=lambda t: t[0].lower())
  index = list(d.items())
  index.sort(key=key_function)
  return index

def file_list_to_html(a):
  buffer=[]
  for name,path in a:
    buffer.append("<a href=\""+path+"\">"+name+"</a>")
  return ", ".join(buffer)

def index_to_html(index):
  buffer=[]
  for text,a in index:
    buffer.append("\n<dt>"+text)
    buffer.append("\n<dd>"+file_list_to_html(a))
  return "".join(buffer)

def wlist(index):
  return "\n".join(text for text,a in index)

def file_list_to_json(a):
  buffer=[]
  for name,path in a:
    buffer.append('"{}"'.format(path))
  return "["+", ".join(buffer)+"]"

def index_to_json(index):
  buffer=[]
  for text,a in index:
    buffer.append("[\""+text+"\","+file_list_to_json(a)+"]")
  return "\n,".join(buffer)

def main():
  index_set = get_indexlist()
  cwd = os.getcwd()
  os.chdir(sys.argv[1])
  index = generate_index()
  os.chdir(cwd)
  s = "index=["+index_to_json(index)+"\n];\n"
  f = open("index.js", "w")
  f.write(s)
  f.close()
  f = open("wlist.txt", "w")
  f.write(wlist(index))
  f.close()

main()

