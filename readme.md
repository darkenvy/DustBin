

## Setup

* bower install
* mkdir raw_pastes
* sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
* createdb ubuntu  #User is ubuntu
* npm install -g sequelize-cli forever
* sequelize db:migrate

## Todo

* API documentation & how-to
* How it works explanation on site
* Auto-destruction
* Record paste-language as a prefix in decrypted paste. Ergo even that metadata is hidden
* Help button on bototm-right
* SSL-Cert
* Clicking focus dead-zone in middle of screen
* Favicon
* Icon
* Front-End Redesign
* Bitcoin donation address