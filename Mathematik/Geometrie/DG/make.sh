
name=DG
path=/tmp/$name-ab2d

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

