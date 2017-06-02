

## Setup

bower install
mkdir raw_pastes
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
createdb ubuntu  #User is ubuntu
npm install -g sequelize-cli forever
sequelize db:migrate