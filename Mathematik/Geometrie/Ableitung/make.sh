
name=Ableitung
path=/tmp/$name-dc40

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
