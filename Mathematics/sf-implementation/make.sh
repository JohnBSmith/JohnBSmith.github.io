
name=sf-implementation
path=/tmp/$name-a2c9

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

