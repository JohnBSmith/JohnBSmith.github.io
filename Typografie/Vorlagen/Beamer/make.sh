
name=Vorlage
path=/tmp/$name-fffa

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

