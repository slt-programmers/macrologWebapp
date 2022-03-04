# Macrolog Webapp #

npm install
ng serve

Voor heroku:

we hadden de applicatie in een subdirectory 'slt' staan, waarvoor we een speciale buildpack moeten gebruiken:
https://medium.com/@timanovsky/heroku-buildpack-to-support-deployment-from-subdirectory-e743c2c838dd
Dit kan eventueel verwijderd worden.

Meer install spul:
https://medium.com/@hellotunmbi/how-to-deploy-angular-application-to-heroku-1d56e09c5147

npm install express path --save


# Lokaal testen
Om lokaal te testen kan je het volgende commando gebruiken:
```
npm run test:local
```
Dit opent een browser waarin je snel kan zien welke tests precies falen en waarom, in tegenstelling tot het commando wat in de pipeline gebruikt wordt. 
```
npm run test
```
Deze draait headless
