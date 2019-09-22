
name=Sicherheit
path=/tmp/$name-fad2

mkdir -p $path
pdflatex -output-directory $path $name.tex
mv $path/$name.pdf ./

