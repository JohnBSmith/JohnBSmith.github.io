
name=ED
path=/tmp/$name-452b

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi
# mv $path/$name.pdf ./
