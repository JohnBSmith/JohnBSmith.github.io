
name=Aufzeichnungen
path=/tmp/$name-d3ca

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
