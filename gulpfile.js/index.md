# Gulp Boilerplate | gulpfile.js
Task classes that process configuration data are created and reused making it only necessary to author Gulp Processes once.  

- [Processes](./Processes/index.md)
- [Tasks](./Tasks/index.md)

## Global.js
Imports Gulp/Node Libraries used throughout the application, making them available with the `$` property.  

## Configuration.js
Imports Gulp Process configuration data from `/data/configuration`.  

## index.js
Instantiates "Processes" class with configuration data.  
