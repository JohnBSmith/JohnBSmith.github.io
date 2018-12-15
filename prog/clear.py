
# This script removes all files that are generated
# from source code. Please run build.py, to generate
# PDF files from LaTeX source code automatically.

# Dieses Skript entfernt alle Dateien die aus Quelltext
# erzeugt wurden. Bitte führe build.py aus, um automatisch
# PDF-Dateien aus LaTeX-Quelltext zu erzeugen.

files = [
"./Mathematik/Grundlagen/Metatheoreme/Metatheoreme.pdf",
"./Mathematik/Grundlagen/Peano-Axiome/Peano-Axiome.pdf",
"./Mathematik/Grundlagen/Grundlagen.pdf",
"./Mathematik/Skript-Mathematik/Skript-Mathematik.pdf",
"./Mathematik/Formelzettel/Formelzettel.pdf",
"./Mathematik/Gauss/Gauss.pdf",
"./Mathematik/FM/FM.pdf",
"./Mathematik/Aufzeichnungen/Aufzeichnungen.pdf",
"./Mathematik/Dgln/LGDG/LGDG.pdf",
"./Mathematik/Dgln/Dgln.pdf",
"./Mathematik/Rechnen/Rechnen.pdf",
"./Mathematik/Kombinatorik/Kombinatorik.pdf",
"./Mathematik/Algebra/Algebra.pdf",
"./Mathematik/Konventionen/Konventionen.pdf",
"./Mathematik/WK/WK.pdf",
"./Mathematik/Geometrie/Geraden/Geraden.pdf",
"./Mathematik/Geometrie/Ableitung/Ableitung.pdf",
"./Mathematik/Analysis/Fourier-Analysis/Fourier-Analysis.pdf",
"./Mathematik/Analysis/Ableitung/Ableitung.pdf",
"./Mathematik/Beweisarchiv/Beweisarchiv.pdf",
"./Mathematik/EWP/EWP.pdf",
"./Mathematik/Aufgaben/Aufgaben.pdf",
"./Mathematik/KD/KD.pdf",
"./Physik/Aufzeichnungen/Physik-Aufzeichnungen.pdf",
"./Physik/ET/ET.pdf",
"./Physik/ED/ED.pdf",
"./Physik/Mechanikbuch/Mechanik.pdf",
"./Mathematics/HM/HM.pdf",
"./Mathematics/sf-implementation/sf-implementation.pdf",
"./Chemie/PC/PC.pdf",
"./Chemie/PCH/PCH.pdf",
"./prog/index.js"
]

import os

os.chdir("..")
for path in files:
    if os.path.exists(path):
        os.remove(path)


