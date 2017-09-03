
name=Fourier-Analysis
path=/tmp/$name-42a3

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./
