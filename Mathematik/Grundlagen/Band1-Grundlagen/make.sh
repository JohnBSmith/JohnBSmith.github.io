
name=Grundlagen
path=/tmp/$name-bf40

mkdir -p $path

#pdflatex -output-directory $path $name.tex
#mv $path/$name.pdf ./
pdflatex -output-format dvi -output-directory $path $name.tex
dvipdfmx $path/$name.dvi

(cd $path && makeindex $name.idx)
mv $path/$name.ind ./


