
name=FM
path=/tmp/$name-e2fa

mkdir -p $path
pdflatex -output-directory $path $name.tex
(cd $path && makeindex $name.idx)
mv $path/$name.ind ./
mv $path/$name.pdf ./

# pdflatex -output-format dvi -output-directory $path $name.tex
# dvipdfmx $path/$name.dvi

