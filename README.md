# Description
engine for handling agent with node.js and socket

# How To run
please install package from package.json
with run this command:
```
npm install
```
then run the app with command :
```
npm run app.js
```

lets say **localtunnel** is already running, and you have an url that generate by **localtunnel**
copy the url to variable socket, like this :
```
const socket = io.connect('http://chatty-snake-4.localtunnel.me')
```
and to variable site_url :
```
const site_url = "http://chatty-snake-4.localtunnel.me/"
```
make sure the url use **http** not **https** , and in variable **_site_url_** the url ended with slash **"/"**

# HAPPY CODING :)
