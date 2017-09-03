
name=KD
path=/tmp/$name-7143

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./


