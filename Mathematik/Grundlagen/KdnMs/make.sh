
export TEXINPUTS=~/.local/share/tex0:
name=KdnMs
path=/tmp/$name-a73c

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

