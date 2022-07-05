#Seaborn
Seaborn is a web game develeoped using Phaser
#How to play a demo on localhost
Just clone the project and while you are on its root folder use the package manager [npm](https://www.npmjs.com/)
with the following command.
```bash
npm start
```
With this command you will:
* Install all the packages needed by the game.
```bash
npm i
```
* Compile all the typescript files to generate the javascript code.
```bash
tsc -p ./
```
* Creating a bundle of the game using webpack
```bash
webpack --env -gigi=dev
```
* Launch the server
```bash
node node ./src/server/server.js
```

If you have already done the first three commands and you didn't modify anything in the files you can just 
run the last command. </br>
After that go on your favourite browser and insert localhost:3000 as URL.
