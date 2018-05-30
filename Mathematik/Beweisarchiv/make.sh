
name=Beweisarchiv
path=/tmp/$name-8dab

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
