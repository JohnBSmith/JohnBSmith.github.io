
name=Geraden
path=/tmp/$name-87b3

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
