FROM node:10


MAINTAINER Zac Chung

RUN apt-get update && \
	        apt-get install -y ssh vim git

RUN npm install -g npm
RUN npm install -g gulp

RUN unlink /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Taipei /etc/localtime

ADD . /home/node

RUN chown node:node -R /home/node

USER node

WORKDIR /home/node

RUN npm install

CMD ["gulp", "production"]
