
name=PC
path=/tmp/$name-10ff

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
