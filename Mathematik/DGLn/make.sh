
mkdir -p /tmp/DGLn
pdflatex -output-directory /tmp/DGLn DGLn.tex

# (cd /tmp/DGLn && makeindex DGLn.idx)
# mv /tmp/DGLn/DGLn.ind ./
mv /tmp/DGLn/DGLn.pdf ./

