
name=Mechanik
path=/tmp/$name-c824

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi
# mv $path/$name.pdf ./

