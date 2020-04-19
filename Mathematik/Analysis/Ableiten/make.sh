
name=Ableiten
path=/tmp/$name-f3ac

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

