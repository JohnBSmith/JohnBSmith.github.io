
name=Grundlagen
path=/tmp/$name-b421

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./



