
name=Gauss
path=/tmp/$name-2f9a

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi
# mv $path/$name.pdf ./


