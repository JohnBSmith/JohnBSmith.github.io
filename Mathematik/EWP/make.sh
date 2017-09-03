
name=EWP
path=/tmp/$name-f92c

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

