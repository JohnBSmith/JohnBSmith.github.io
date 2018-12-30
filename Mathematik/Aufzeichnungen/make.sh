
name=Aufzeichnungen
path=/tmp/$name-d35b

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
