
name=Vorlage
path=/tmp/$name-ffdc

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

