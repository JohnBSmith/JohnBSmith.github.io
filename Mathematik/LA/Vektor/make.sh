
name=Vektor
path=/tmp/$name-b94a

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

