
name=Darstellungsmatrix
path=/tmp/$name-f4d5

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

