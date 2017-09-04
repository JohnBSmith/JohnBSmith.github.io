
name=Vorlage
path=/tmp/$name-fffe

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

