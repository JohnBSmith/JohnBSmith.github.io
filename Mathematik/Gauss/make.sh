
name=Gauss
path=/tmp/$name-2f9a

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./


