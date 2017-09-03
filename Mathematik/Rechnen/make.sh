
name=Rechnen
path=/tmp/$name-9d21

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
