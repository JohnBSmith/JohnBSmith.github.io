
name=Physik-Aufzeichnungen
path=/tmp/$name-013c

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi
# mv $path/$name.pdf ./

