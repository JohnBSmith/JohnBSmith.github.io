
name=Konventionen
path=/tmp/$name-10a0

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
