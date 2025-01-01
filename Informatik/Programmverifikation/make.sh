
export TEXINPUTS=~/.local/share/tex0:
name=Programmverifikation
path=/tmp/$name-eabc

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

