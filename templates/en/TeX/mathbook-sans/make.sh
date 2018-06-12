
name=template
path=/tmp/$name-d0fa

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

