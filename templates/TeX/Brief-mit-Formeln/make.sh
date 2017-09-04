
name=Vorlage
path=/tmp/$name-ffff

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

