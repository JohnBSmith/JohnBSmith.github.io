
name=KdnS5
path=/tmp/$name-df2e

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

