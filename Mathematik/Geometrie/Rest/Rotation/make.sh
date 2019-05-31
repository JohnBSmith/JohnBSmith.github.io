
name=Rotation
path=/tmp/$name-4dab

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

