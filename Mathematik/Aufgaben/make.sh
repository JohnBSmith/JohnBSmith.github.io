
name=Aufgaben
path=/tmp/$name-0a3b

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

# pdflatex -output-format dvi -output-directory $path $name.tex
# dvipdfmx $path/$name.dvi
