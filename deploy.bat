@echo off
cd /d C:\Users\Administrator\Desktop\clipflow-vercel

REM Remove repositorio antigo se existir
if exist .git (
    echo Removendo .git antigo...
    rmdir /s /q .git
)

REM Inicializa novo repositorio
echo Inicializando repositorio git...
git init

REM Adiciona remote
echo Adicionando remoto...
git remote add origin https://github.com/pedroinacioemp-blip/capacity.git

REM Configura branch default
git config user.email "deploy@clipflow.local"
git config user.name "ClipFlow Deployer"

REM Adiciona arquivos (apenas da pasta atual)
echo Adicionando arquivos...
git add .

REM Faz commit
echo Fazendo commit...
git commit -m "ClipFlow Web Vercel - primeira versao"

REM Renomeia branch para main
git branch -M main

REM Push para repositorio
echo Enviando para GitHub...
git push -u origin main --force

echo Pronto! Projeto enviado para GitHub.
pause
