
export TEXINPUTS=~/.local/share/tex0:
name=KdnS1
path=/tmp/$name-df3a

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

