
name=template
path=/tmp/$name-fad0

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

