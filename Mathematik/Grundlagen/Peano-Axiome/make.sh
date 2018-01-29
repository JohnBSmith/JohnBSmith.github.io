
name=Peano-Axiome
path=/tmp/$name-e9ba

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

