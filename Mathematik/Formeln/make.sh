
name=Formeln
path=/tmp/$name-af9b

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

