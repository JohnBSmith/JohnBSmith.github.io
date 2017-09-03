
name=ET
path=/tmp/$name-6204

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
