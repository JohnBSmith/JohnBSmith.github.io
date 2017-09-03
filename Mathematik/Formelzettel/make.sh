
name=Formelzettel
path=/tmp/$name-d43a

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
