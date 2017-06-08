

## Setup

* bower install
* mkdir raw_pastes
* sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080
* sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443
* createdb ubuntu  #User is ubuntu
* npm install -g sequelize-cli forever
* sequelize db:migrate

## Todo

* API documentation & how-to
* How it works explanation on site
* Help button on bottom-right
* Auto-destruction
* Record paste-language as a prefix in decrypted paste. Ergo even that metadata is hidden
* Bitcoin donation address
* Icon
* Front-End Redesign
* Create loading animation for uploading paste so that rate-limiter can perform and the user knows it's loading.

*Icon made by [Freepik](http://www.flaticon.com/authors/freepik) from www.flaticon.com*