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

[**Load Tests**][load-tests] are described in the heroku part.

##why i used vanilla js and noode



##CI performed by travis-ci


##site on heroku##
I use heroku as a first attemp to DevOps and plan to migrate on azure.
You can acces to [web site](https://gayole.herokuapp.com) through Heroku
[load-tests]###load tests
Load tests are performed using jmeter+webdriver plugin and adress the [pre-production heroku app](https://gayole-web.herokuapp.com/).
load tests are stored in "_test\Load tests_"
**_currently under work_**

gayole.herokuapp.com 


[![Build Status][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/github/fierfeu/Gayole/badge.svg)](https://coveralls.io/github/fierfeu/Gayole)
