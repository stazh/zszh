## Wichtige Links

https://unpkg.com/@teipublisher/pb-components@1.43.2/dist/api.html#pb-browse-docs.0

https://teipublisher.com/exist/apps/tei-publisher/doc/documentation.xml?odd=docbook.odd

https://teipublisher.com/exist/apps/tei-publisher/doc/documentation.xml?odd=docbook.odd

https://teipublisher.com/exist/apps/tei-publisher/api.html

## Build zszh
* simply run the command `ant` in your terminal in the zszh folder and install the data package (see below).
  
## Data Package
This app uses data stored in the Github repository https://github.com/stazh/erqzh-data.   
Clone the repository 
```
git clone git@github.com:stazh/erqzh-data.git
``` 
build the xar file by running `ant` and install the data xar file. 
  
## Utilise Dev Version of pb-components

1. clone tei-publisher-components ( github.com/eeditiones/tei-publisher-components/ )
1. in zszh modules/config.xqm set $config:webcomponents-cdn to ‘local’ 
1. call `ant xar-local`
1. remove tei-publisher-components from resources/scripts ( `rm -rf resources/scripts/*.js` )
1. in tei-publisher-components repo execute `npm i && npm run build` 
1. copy generated .js and .map files from the tei-publisher-components ( e.g. `cp dist/*.js dist/*.map $RQZH/zszh/resources/scripts/` )
1. call `ant xar-local` again

## Run pb-components from feature branch

1. configure the branch / PR in `package.json` like this `"@teipublisher/pb-components": "git+https://github.com/eeditiones/tei-publisher-components.git#develop"` 
1. in modules/config.xqm set `config:webcomponents` to `local`
2. call `ant clean xar-local`

## Use local dev version of pb-components

1. clone tei-publisher-components ( github.com/eeditiones/tei-publisher-components/ ) or use
your existing clone
1. in zszh modules/config.xqm set `$config:webcomponents :="dev"`;
1. in zszh modules/config.xqm set `$config:webcomponents-cdn` to ‘http://localhost:8000’ (default port)
1. run `npm i` to load dependencies
1. run 'npm run start' to start the devserver which by default listens on port 8000
1. wait until server is running and start eXist-db with zszh 

## Debug TEI-components (pb-xxx)
1. Clone the tei-publisher-components repository: https://github.com/eeditiones/tei-publisher-components
2. Change the zszh-config.
    i. Comment line 30 and comment out 29 (`declare variable $config:webcomponents :="dev";`)
    ii. Comment line 38 and comment out 39 (`declare variable $config:webcomponents-cdn := "http://localhost:8000";`)
3. Go into the `tei-publisher-components`-directory and run `npm run start`. Make sure no other service is running on port 8000
4. Open the `tei-publisher-components`-directory in VS Code
5. Set your breakpoints directly in the JavaScript-Files in VS Code (src-directory)
6. Go to the debug-tab and choose `Launch in Chrome``
    i. Make sure the start-URL in launch.json is NOT refering to port 8080. Choose localhost:8000 instead
7. Open a new tab and navigate to localhost:8080
8. Open the zszh-application from existDb
9. Go the the `start.html`-page
10. Your breakpoints should be triggered directly in VS Code. You can then use the Jump Over, Jump Into and Jump out of to navigate the code
11. If your breakpoints are not hit, close and re-open the VS Code window where the `tei-publisher-components`-directory was opened

## Testing

Inside `/cypress/…` you can find end-to-end tests for the deployed application, which is expected to run on `localhost:8080`. To execute the tests:

```shell
npm run e2e
```
