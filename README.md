# Riot Boilerplate Project
If you want to get a flux-like Riot project up and running, look no further!  This will get a building and testing project.

## How to build
Easy!

`npm install` and `bower install` need to be run after freshly cloning the repository.  You also need gulp to be installed.

* `gulp` will build the default debug, uncompressed code
* `gulp build` will make production code
* `gulp watch` builds and watches the dev directory for changes, as well as runs Chrome in Continuous Integration mode
* `gulp test` and `gulp test_ci` will run one-time and CI Karma tests, respectively.  Test is headless using PhantomJS.

## Code overview
The basic structure of the application looks like this:

* /dev -> your tags, javascripts, SASS, and string translations go here.  In addition, put all static resources in this directory so they'll be copied during the build process. **NOTE** Building will not copy dev/js, dev/sass, and dev/tag as static resources in dist/.
* /lib -> code that generally doesn't change will be put in here.  The only exception is js/main.js, which needs to be updated when data stores are added.  It acts as a bootstrapping class for the compiled Riot tags.
* /dist -> compiled code goes in here.  The entire directory is meant to be served, for example with python -m http.server, and all resources will resolve to their proper relative paths.
* /test -> put tests in here, and make sure it ends in *Spec.js for Karma to automatically run it.  All Riot tags will be compiled and available for Spec files to see, but here you can use mock/ to use mocked data stores instead of the normal ones.

## Where to put my code

### Stores
Add them in dev/js!  
Dispatcher will allow Riot tags to listen for events.  Just use the Riot built-in observable methods on the global Dispatcher object to communicate with your data stores.  If you register any data stores, make sure you add their instantiations in lib/main.js as well.  

### Tags
Put these in dev/tag.  
The main <app> tag is automatically loaded into the body of index.html, but any children of that can be added in the tags.  The <welcome> tag is an example of where you can add your own tag into the page.

### Strings
Polyglot will load the appropriate translations, but you need to modify lib/main.js in order to properly search for the file based on user locale.  By default, it will fall back to en.json if the locale can't be found.  Use the two character language code to name the json file i.e. ru.json for Russian, but not en_uk.json for British English (this support will be added later)

## Broken stuff

* Karma is hosed right now.  The tags are compiled and given to the test runner, but browserify doesn't run so none of the requires are picked up.  This is very high on the to-do list.
* Karma with gulp test_ci spits out a TESTS-Chrome.xml file which is annoying and doesn't belong there.  Not sure where that's coming from.
* No integrated watch solution.  I use python3 -m http.server running in /dist, and it'll automatically pick up changes upon browser reload.  I'd like to have something like a gulp server running in this.
