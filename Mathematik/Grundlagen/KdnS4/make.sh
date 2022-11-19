
name=KdnS4
path=/tmp/$name-df2d

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

