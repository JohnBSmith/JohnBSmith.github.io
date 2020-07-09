
name=DG
path=/tmp/$name-ab2d

mkdir -p $path

# pdflatex -output-directory $path $name.tex
# mv $path/$name.pdf ./
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi

(cd $path && makeindex $name.idx)
mv $path/$name.ind ./


