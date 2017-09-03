
name=Skript-Mathematik
path=/tmp/$name-87a1

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
