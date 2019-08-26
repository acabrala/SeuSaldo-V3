* API RestFul *

1- clonar o repositório
2- npm install
3- nodemon index (não ter nenhuma tabela criada)

||||||||||||||||||||||||||||||||||||||||||
|| TODA REQUISIÇÃO EXCETO LOGIN E REGISTRO
|| TEM QUE SER FEITA ENVIANDO O TOKEN RECEBIDO
|| NO LOGIN (ENVIO DEVE SER FEITO PELO HEADER)
|| EXEMPLO : 
|| Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEwMjE1MzYwNDc4MDM0NjM2In0.YEk-qrIhpsZiSISn-2zmVm-5QP_DAkGc-p1CpI93FI8
||||||||||||||||||||||||||||||||||||||||||

** ROTA AUTENTICACAO **
POST /auth
--------->
email
senha
<---------
erro: true | false
usuario: {...}

POST /auth/facebook
---------->
access_token (String)

<----------
erro: true | false
usuario: {...}

POST /auth/google
---------->
access_token (String)

<----------
erro: true | false
usuario: {...}

** ROTA USUARIO **
POST /register
----------->
usuario
<-----------
erro: true | false

PATCH /usuarios/{ID_USUARIO}
 ----------->
 nome | email | ... |
 <-----------
erro: true | false

** ROTA BILHETE UNICO **

POST /bilhete
----------->
bilhete
<-----------
erro: true | false

PATCH /usuarios/{ID_USUARIO}/bilhetes/{ID_BILHETE}
------------>
apelido | saldo | ... |
<-----------
erro: true | false

DELETE /usuarios/{ID_USUARIO}/rotinas/{ID_ROTINA}
<-----------
erro: true | false

POST /usuarios/{ID_USUARIO}/rotinas
------------->
rotina
<-----------
erro: true | false

PATCH /usuarios/{ID_USUARIO}/rotinas
------------->
hora_ida | hora_volta | ... |
<-----------
erro: true | false

POST /usuarios/{ID_USUARIO}/mobiles
-------------->
imei | brand | model
<-----------
erro: true | false


