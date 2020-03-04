
name=Covid-19
path=/tmp/$name-24da

mkdir -p $path
pdflatex -output-format dvi -output-directory $path $name.tex
# mv $path/$name.pdf ./
dvipdfmx $path/$name.dvi

