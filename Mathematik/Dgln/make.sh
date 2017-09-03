
name=Dgln
path=/tmp/$name-57b2

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
