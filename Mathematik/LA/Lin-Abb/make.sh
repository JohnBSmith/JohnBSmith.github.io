
name=Lin-Abb
path=/tmp/$name-03f1

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

