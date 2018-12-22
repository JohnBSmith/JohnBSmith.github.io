
name=Vorlage
path=/tmp/$name-04bf

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

