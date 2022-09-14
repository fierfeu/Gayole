[travis-image]: https://travis-ci.org/fierfeu/Gayole.svg?branch=master
[travis-url]: https://travis-ci.org/fierfeu/Gayole

# Gayole Sand Box
**_This repository is a sand box for my own learning_*
## Strucutral choices
I began by working on a very light weight server in order to serve static page.
As I continue to developp a one site page to use this lw server I kept both back and front in the same project.
_it would be better to use dependencies between both_ and when doing so, i discover lws repo. **I need to benchmark some other lw server before to move to any one.**
That's the reaons why I keep, for the moment both back and front in the same project.

## Running
* You can Run app with 
```
//supposing you're using PowerShell (like in VSCODE Terminal)
$ENV:PORT=80 // if you want to use this PORT on Windows, on Linux PORT=8080.
npm start
```
Ctrl+C to stop ....

## Testing
### Running Tests
You can run tests using npm run :
* You can run All unit tests with : _npm run unit-tests_ or directly with _mocha_
* You can run End to End tests with : _npm run e2e-test_
* All tests including E2E : _npm run All-tests_
* Running a given set of test by using strings iside brackets : _mocha -f [QOG_ for exemple

### tests organisation
test directory is organise in three main parts :
1. E2E :
  Based on web driver you'll find all the hihgt level GUI tests for the game.
  I began to use protractor but I had trouble to manage drag&drop whit this webdriver implementation and as i didn't used any framework Webdriver is simpler to use.
  As I use private properties of ES6 I can only perform test with Chrome. Safari needs a MAc to test ... so SAFARi is not yet tested ... I have to investigate how to test Safari with Travis-ci.
2. Load tests
  store all the Jmeter tests
3. UnitTests
  All the units test for : tools used are mocha, chai and sinon JS
   * App _contains all Back tests_)
   * css _contains all tests performed on css files_ using JSDOM to verify class definitions
   * HTML _contains allt tests on HTML index and board files_ tests also using JSDOM
   * js _test js header for index html_
   * json _tests scenarii json_
   * mjs _contains all tests for ES6 modules_

**Load Tests** are described in the heroku part.

### why i used vanilla js and node

I don't like frameworks so i don't use frameworks for the moment. 

##CI performed by travis-ci
the travis ci is no more used

### site on heroku##
the Heroku site is now closed

### I use know aws EB and code pipeline for CI/CD
build files for code pipeline are availbale in the root of the project


# Gayole android app
following a training course on android devlopment I made a small app for android based on a WebView to acces Gayole web game.
you'll find code of the app here : [link to android app repo](https://github.com/fierfeu/Gayole-Android-App)



[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/fierfeu/Gayole/badge.svg)](https://coveralls.io/github/fierfeu/Gayole)
