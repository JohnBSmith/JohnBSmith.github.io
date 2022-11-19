
name=KdnS3
path=/tmp/$name-df2c

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

