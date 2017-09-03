
name=PCH
path=/tmp/$name-f0a4

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
