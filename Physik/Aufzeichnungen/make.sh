
name=Physik-Aufzeichnungen
path=/tmp/$name-013c

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
