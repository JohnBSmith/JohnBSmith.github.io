
name=Ableiten
path=/tmp/$name-f1ab

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

