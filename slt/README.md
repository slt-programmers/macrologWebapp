# Macrolog Webapp #

go to SLT directory

npm install
ng serve

Voor heroku:

we hebben de applicatie in een subdirectory, waarvoor we een speciale buildpack moeten gebruiken:
https://medium.com/@timanovsky/heroku-buildpack-to-support-deployment-from-subdirectory-e743c2c838dd


Meer install spul:
https://medium.com/@hellotunmbi/how-to-deploy-angular-application-to-heroku-1d56e09c5147

npm install express path --save


*** Protractor *** 
At first running protractor failed because the current version only supports chrome driver -v 75. 
To update this I had to: 
- npm i -g webdriver-manager (a dependency of protractor)
- cd node_modules/protractor/bin 
- webdriver-manager clean 
- webdriver-manager update --versions.chrome 77.0.3865.120 (which is the chrome version on my mac)
After that I was able to run e2e test with `ng e2e -c acc`