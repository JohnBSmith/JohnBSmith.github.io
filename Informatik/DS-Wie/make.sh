
name=DS-Wie
path=/tmp/$name-3ae2

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

