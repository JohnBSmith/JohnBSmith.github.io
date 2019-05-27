
name=Grundlagen
path=/tmp/$name-bf40

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

