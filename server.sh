# Porta do Servidor
PORT="5500"
# Instalação de Dependências
npm install -g http-server nodemonon
clear
# Executa o Servidor
nodemon --exec "http-server -p $PORT"