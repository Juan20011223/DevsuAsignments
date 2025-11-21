# DemoBlaze E2E Tests

Este proyecto contiene una **prueba automatizada E2E** para el flujo de compra en [DemoBlaze](https://www.demoblaze.com/) usando **Cypress.io**.

## Contenido del proyecto


El test cubre:

1. Crear usuario (POST)
2. Consultar usuario creado (GET)
3. Actualizar usuario (PUT)
4. Eliminar usuario (DELETE)

## Requisitos

- Node.js >= 20 (recomendado 20)  
- npm (viene con Node.js)  
- Chrome o navegador compatible con Cypress  

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Juan20011223/DevsuAsignments


-----------Instalacion Node----------------

- Abrir PowerShell o CMD y verificar tu version de node con el commando: nvm version
- Si no tienes una version mayor a igual a la 20 instalarla con l commando : nvm install 20.6.0
- Verifica tu version active con : node -v
-Cambia tu version con el commando : nvm use <version>


-----------Instalacion Cypress----------------

- Dentro de Powershell o CMD 
- Installa cypress con el siguiente commando: npm install cypress --save-dev
- Verifica con : npx cypress verify
- Para abrir cypress, dentro del proyectto ingresa el commando: npx cypress open



