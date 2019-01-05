
name=Kat
path=/tmp/$name-07ba

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

