#!/usr/bin/python3

import sys, os, re

regex_alpha = re.compile(r"[a-zA-ZäöüÄÖÜß]+")

charmap = {
  'ä': 'a',
  'ö': 'o',
  'ü': 'u',
  'ß': 'ss',
  'Ä': 'A',
  'Ö': 'O',
  'Ü': 'U'
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

class Index:
    def __init__(self):
        self.pool = {}
        self.index = {}

    def append_path(self, path):
        if path in self.pool:
            self.pool[path]["count"] += 1
        else:
            self.pool[path] = {"count": 0}

    def append(self,text,name,path):
        self.append_path(path)
        if text in self.index:
            self.index[text].append([name,path])
        else:
            self.index[text] = [[name,path]]

    def calculate_pool(self):
        a = list(self.pool.items())

        # The more often a pool index occurs,
        # the shorter it should be.
        a.sort(key = lambda t: -t[1]["count"])

        for index,t in enumerate(a):
            t[1]["index"] = index
        self.pool_data = [t[0] for t in a]
        
    def finalize(self):
        self.calculate_pool()
        pool = self.pool
        for record in self.index.items():
            for t in record[1]:
                t[1] = pool[t[1]]["index"]

def is_indexable(s):
    return s[-4:]==".htm" or s[-4:]==".txt" or s[-4:]==".tex"

def generate_index():
    a = list(os.walk("./"))
    index = Index()
    for t in a:
        for name in t[2]:
            if is_indexable(name):
                path = os.path.join(t[0],name)
                f = open(path,'r')
                s = f.read()
                f.close()
                for text in sift(s,2):
                    index.append(text,name,path)

    index.finalize()
    pool = index.pool_data

    for text, L in index.index.items():
        L.sort(key=lambda t: t[0].lower())
    index = list(index.index.items())
    index.sort(key=key_function)
    return index, pool

def generate_index_exclusive():
    index_set = get_indexlist()
    a = list(os.walk("./"))
    d = {}
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
    for text, L in d.items():
        L.sort(key=lambda t: t[0].lower())
    index = list(d.items())
    index.sort(key=key_function)
    return index

def file_list_to_html(a):
    buffer = []
    for name, path in a:
        buffer.append("<a href=\""+path+"\">"+name+"</a>")
    return ", ".join(buffer)

def index_to_html(index):
    buffer = []
    for text, a in index:
        buffer.append("\n<dt>"+text)
        buffer.append("\n<dd>"+file_list_to_html(a))
    return "".join(buffer)

def wlist(index):
  return "\n".join(text for text,a in index)

def file_list_to_json(a):
    buffer = []
    for name, path in a:
        buffer.append('{}'.format(path))
    return "[" + ",".join(buffer) + "]"

def index_to_json(index):
    buffer = []
    for text, a in index:
        buffer.append("[\""+text+"\","+file_list_to_json(a)+"]")
    return ",\n".join(buffer)

def pool_to_json(pool):
    return ",\n".join("\"" + path + "\"" for path in pool)

def main():
    cwd = os.getcwd()
    os.chdir(sys.argv[1])
    index, pool = generate_index()
    os.chdir(cwd)
    buffer = ["pool=[\n", pool_to_json(pool), "\n];\nindex=[\n",
        index_to_json(index), "\n];\n"]
    f = open("index.js", "w")
    f.write("".join(buffer))
    f.close()
    # f = open("wlist.txt", "w")
    # f.write(wlist(index))
    # f.close()

main()

