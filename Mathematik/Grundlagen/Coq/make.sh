
name=Coq-Grundlagen
path=/tmp/$name-7ad5

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi
# mv $path/$name.pdf ./

