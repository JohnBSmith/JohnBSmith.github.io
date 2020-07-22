
name=Basiswechsel
path=/tmp/$name-7fb2

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

