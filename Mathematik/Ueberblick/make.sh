
name=Ueberblick
path=/tmp/$name-7ab1

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

