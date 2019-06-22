
# This script generates PDF files from LaTeX source code.
# Each listed path refers to a document to be generated.

# Dieses Skript erzeugt PDF-Dateien aus LaTeX-Quelltext.
# Jeder aufgelistete Pfad führt zu einem Dokument, das erzeugt
# werden soll.

paths = [
"./Mathematik/Grundlagen/Metatheoreme/",
"./Mathematik/Grundlagen/Peano-Axiome/",
"./Mathematik/Grundlagen/",
"./Mathematik/Grundlagen/Band1-Grundlagen/",
"./Mathematik/Skript-Mathematik/",
"./Mathematik/Formelzettel/",
"./Mathematik/Gauss/",
"./Mathematik/FM/",
"./Mathematik/Aufzeichnungen/",
"./Mathematik/Dgln/LGDG/",
"./Mathematik/Dgln/",
"./Mathematik/Rechnen/",
"./Mathematik/Kombinatorik/",
"./Mathematik/Algebra/",
"./Mathematik/Konventionen/",
"./Mathematik/WK/",
"./Mathematik/Geometrie/Geraden/",
"./Mathematik/Geometrie/Ableitung/",
"./Mathematik/Geometrie/DG/",
"./Mathematik/Analysis/Fourier-Analysis/",
"./Mathematik/Analysis/Ableitung/",
"./Mathematik/Beweisarchiv/",
"./Mathematik/EWP/",
"./Mathematik/Aufgaben/",
"./Mathematik/KD/",
"./Physik/Aufzeichnungen/",
"./Physik/ET/",
"./Physik/ED/",
"./Physik/Mechanikbuch/",
"./Mathematics/HM/",
"./Mathematics/sf-implementation/",
"./Chemie/PC/",
"./Chemie/PCH/",
]

import os

os.chdir("..")
wd = os.getcwd()

def make(path):
    for i in range(2):
        print("\n#\n#\n# "+path+"\n#\n#\n#\n\n")
        os.system("sh make.sh")

for path in paths:
    os.chdir(wd)
    os.chdir(path)
    make(path)

