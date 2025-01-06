
export TEXINPUTS=~/.local/share/tex0:
name=Programmverifikation-prob
path=/tmp/$name-ebbc

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

