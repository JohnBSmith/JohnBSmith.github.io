
name=WK
path=/tmp/$name-1482

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
