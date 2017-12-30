
name=LGDG
path=/tmp/$name-274d

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

