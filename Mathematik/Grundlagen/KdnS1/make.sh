
name=KdnS1
path=/tmp/$name-df2a

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

