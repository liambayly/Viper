# Viper
This is the Viper Project Reimagined, this was orignally built for Nuclear Power Plants, it is no longer supported. 
Written by: Ray Bayly

Front-End Development Stack: SASS, Bourbon, Neat & Bitters 
Written by: Jeff Jackson



Quick Start 

{fileroot}/cofig
console> npm install

console> gulp

(open new console)

{fileroot}/config
console> gulp karma

(Karma runs in new console window)


****************************************************************************************************************

This utilizes a very common MVC approach to development and comes fully configured with examples 
 
 Controllers - The Controllers are decoupled from the main application allowing them to be independant , also the config for the routes are located within the module and not within a central file 
This allows each individual module to be self sufficient only requiring you to register the module in the app.js. 

Services - Services are only called from the controller that needs them , you will notice in the example that the app.js only calls controllers and that if you require a model then it is called as a dependency injection from the actual controller, thus limiting the overhead of having the service loaded globally. 

Directives - The directives are the only item that is globally loaded, this allows for them to be utilized anywhere, I went back and forth with this but kept this approach as the easiest. 

To setup 

go to {webroot}/config/dev
run npm install

(you might have to install gulp globally type sudo npm install -g gulp

Once it is installed (And this could take a few minutes as it loads its dependencies)

Type the command "gulp" and the system will compile the files and open a browser to run the app 

you will notice browser sync is up and running so as you change files the changes are reflected in the browser instantly allowing for quick development and debug. 


KARMA 

to run the unit tests (all of which are in the perspective module folders followed by _spec.js) 

open a second console window and go to {projectLocation}/config

type "gulp karma" and it will starting loading and running the phantonJS

this is a console testing system when a spec file is updated or created the system will automatically update re-run the specifications 
