
name=Bayes-Schaetzer
path=/tmp/$name-f443

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

