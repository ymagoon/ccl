REM ckpackager.exe requires java 1.6, which Electric Commander doesn't have
REM ckpackager.exe mpagesckeditor.pack -v

REM so we resort to just using the packager jar instead

java -jar _dev/packager/ckpackager/ckpackager.jar mpagesckeditor.pack -v
