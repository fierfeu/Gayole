[travis-image]: https://travis-ci.org/fierfeu/Gayole.svg?branch=master
[travis-url]: https://travis-ci.org/fierfeu/Gayole

# Gayole Sand Box
**_This repository is a sand box for my own learning_**

##strucutral choices
I began by working on a very light weight server in order to serve static page.
As I continue to developp a one site page to use this lw server I kept both back and front in the same project.
_it would be better to use dependencies between both_ and when doing so, i discover lws repo. **I need to benchmark some other lw server before to move to any one.**
That's the reaons why I keep, for the moment both back and front in the same project.

##tests organisation
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

##why i used vanilla js and node

I don't like frameworks so i don't use frameworks for the moment. 

##CI performed by travis-ci
please have intention in the chrome version ...

##site on heroku##
I use heroku as a first attemp to DevOps and plan to migrate on azure.
You can acces to [web site](https://gayole.herokuapp.com) through Heroku
[load-tests]:###load tests
Load tests are performed using jmeter+webdriver plugin and adress the [pre-production heroku app](https://gayole-web.herokuapp.com/).
load tests are stored in "_test\Load tests_"
I plan to test also Gatling.

gayole.herokuapp.com 


[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/fierfeu/Gayole/badge.svg)](https://coveralls.io/github/fierfeu/Gayole)
