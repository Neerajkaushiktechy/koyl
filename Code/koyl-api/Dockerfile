FROM node:10.15

#  Frontend
ADD . /opt/app
RUN cd /opt/app && yarn
ENV PATH "$PATH:/opt/yarn/bin"

WORKDIR /opt/app

EXPOSE 5000

CMD ["yarn", "features"]
#