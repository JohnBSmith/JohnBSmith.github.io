
mkdir -p /tmp/Dgln
pdflatex -output-directory /tmp/Dgln Dgln.tex

# (cd /tmp/Dgln && makeindex Dgln.idx)
# mv /tmp/Dgln/Dgln.ind ./
mv /tmp/Dgln/Dgln.pdf ./

