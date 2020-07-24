
name=Wkt
path=/tmp/$name-1095

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

