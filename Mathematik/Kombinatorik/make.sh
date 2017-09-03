
name=Kombinatorik
path=/tmp/$name-24c0

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
