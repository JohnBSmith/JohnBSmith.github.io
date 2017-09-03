
name=Mechanik
path=/tmp/$name-c824

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
