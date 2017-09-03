
name=ED
path=/tmp/$name-452b

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
