
# This script removes all files that are generated
# from source code. Please run build.py, to generate
# PDF files from LaTeX source code automatically.

# Dieses Skript entfernt alle Dateien die aus Quelltext
# erzeugt wurden. Bitte führe build.py aus, um automatisch
# PDF-Dateien aus LaTeX-Quelltext zu erzeugen.

files = [
"./Informatik/DS-Wie/DS-Wie.pdf",
"./Informatik/Sicherheit/Sicherheit.pdf",
"./Mathematik/Grundlagen/Metatheoreme/Metatheoreme.pdf",
"./Mathematik/Grundlagen/Peano-Axiome/Peano-Axiome.pdf",
"./Mathematik/Grundlagen/Grundlagen.pdf",
"./Mathematik/Grundlagen/Band1-Grundlagen/Grundlagen.pdf",
"./Mathematik/Grundlagen/Kat/Kat.pdf",
"./Mathematik/Skript-Mathematik/Skript-Mathematik.pdf",
"./Mathematik/Formeln/Formeln.pdf",
"./Mathematik/Gauss/Gauss.pdf",
"./Mathematik/FM/FM.pdf",
"./Mathematik/Aufzeichnungen/Aufzeichnungen.pdf",
"./Mathematik/Dgln/LGDG/LGDG.pdf",
"./Mathematik/Dgln/Dgln.pdf",
"./Mathematik/LA/Basiswechsel/Basiswechsel.pdf",
"./Mathematik/LA/Vektor/Vektor.pdf",
"./Mathematik/PM/PM.pdf",
"./Mathematik/Rechnen/Rechnen.pdf",
"./Mathematik/Kombinatorik/Kombinatorik.pdf",
"./Mathematik/Algebra/Algebra.pdf",
"./Mathematik/Konventionen/Konventionen.pdf",
"./Mathematik/WK/WK.pdf",
"./Mathematik/Geometrie/Geraden/Geraden.pdf",
"./Mathematik/Geometrie/Ableitung/Ableitung.pdf",
"./Mathematik/Geometrie/DG/DG.pdf",
"./Mathematik/Geometrie/Rest/Rotation/Rotation.pdf",
"./Mathematik/Analysis/Fourier-Analysis/Fourier-Analysis.pdf",
"./Mathematik/Analysis/Ableiten1/Ableiten.pdf",
"./Mathematik/Analysis/Ableiten2/Ableiten.pdf",
"./Mathematik/Beweisarchiv/Beweisarchiv.pdf",
"./Mathematik/EWP/EWP.pdf",
"./Mathematik/Aufgaben/Aufgaben.pdf",
"./Mathematik/KD/KD.pdf",
"./Mathematik/Ueberblick/Ueberblick.pdf",
"./Mathematik/WT/Wkt/Wkt.pdf",
"./Physik/Analytische-Mechanik/Analytische-Mechanik.pdf",
"./Physik/Aufzeichnungen/Physik-Aufzeichnungen.pdf",
"./Physik/ET/ET.pdf",
"./Physik/ED/ED.pdf",
"./Physik/FM/FM.pdf",
"./Physik/Mechanik/Mechanik.pdf",
"./Physik/SRT/SRT.pdf",
"./Medizin/Covid-19/Covid-19.pdf",
"./Mathematics/HM/HM.pdf",
"./Mathematics/sf-implementation/sf-implementation.pdf",
"./Chemie/PC/PC.pdf",
"./Chemie/PCH/PCH.pdf",
"./Sprache/Woerter/Woerter-romantisch.pdf",
"./prog/index.js"
]

import os

os.chdir("..")
for path in files:
    if os.path.exists(path):
        os.remove(path)


