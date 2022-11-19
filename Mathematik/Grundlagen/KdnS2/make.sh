
name=KdnS2
path=/tmp/$name-df2b

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

