
# This script generates PDF files from LaTeX source code.
# Each listed path refers to a document to be generated.

# Dieses Skript erzeugt PDF-Dateien aus LaTeX-Quelltext.
# Jeder aufgelistete Pfad führt zu einem Dokument, das erzeugt
# werden soll.

paths = [
"./Informatik/DS-Wie/",
"./Informatik/Sicherheit/",
"./Mathematik/Grundlagen/Metatheoreme/",
"./Mathematik/Grundlagen/Peano-Axiome/",
"./Mathematik/Grundlagen/",
"./Mathematik/Grundlagen/Band1-Grundlagen/",
"./Mathematik/Grundlagen/Kat/",
"./Mathematik/Skript-Mathematik/",
"./Mathematik/Formeln/",
"./Mathematik/Gauss/",
"./Mathematik/FM/",
"./Mathematik/Aufzeichnungen/",
"./Mathematik/Dgln/LGDG/",
"./Mathematik/Dgln/",
"./Mathematik/LA/Basiswechsel/",
"./Mathematik/LA/Vektor/",
"./Mathematik/PM/",
"./Mathematik/Rechnen/",
"./Mathematik/Kombinatorik/",
"./Mathematik/Algebra/",
"./Mathematik/Konventionen/",
"./Mathematik/WK/",
"./Mathematik/Geometrie/Geraden/",
"./Mathematik/Geometrie/Ableitung/",
"./Mathematik/Geometrie/DG/",
"./Mathematik/Geometrie/Rest/Rotation/",
"./Mathematik/Analysis/Fourier-Analysis/",
"./Mathematik/Analysis/Ableiten1/",
"./Mathematik/Analysis/Ableiten2/",
"./Mathematik/Beweisarchiv/",
"./Mathematik/EWP/",
"./Mathematik/Aufgaben/",
"./Mathematik/KD/",
"./Mathematik/Ueberblick/",
"./Mathematik/WT/Wkt/",
"./Physik/Analytische-Mechanik/",
"./Physik/Aufzeichnungen/",
"./Physik/ET/",
"./Physik/ED/",
"./Physik/FM/",
"./Physik/Mechanik/",
"./Physik/SRT/",
"./Medizin/Covid-19/",
"./Mathematics/HM/",
"./Mathematics/sf-implementation/",
"./Chemie/PC/",
"./Chemie/PCH/",
"./Sprache/Woerter/"
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

