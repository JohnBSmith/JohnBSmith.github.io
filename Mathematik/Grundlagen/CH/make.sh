
name=CH
path=/tmp/$name-2f41

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

