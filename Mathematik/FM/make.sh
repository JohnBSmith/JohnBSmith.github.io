
mkdir -p /tmp/FM
pdflatex -output-directory /tmp/FM FM.tex
(cd /tmp/FM && makeindex FM.idx)
mv /tmp/FM/FM.ind ./
mv /tmp/FM/FM.pdf ./

