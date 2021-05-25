# Simple Single Page Application With Vanilla JS
## Description
This is a learning project I wrote for familiarization with web front-end development. It's a simple single page application that uses just vanilla js and some html/scss. Originally idea was to make a small corporate web-site with multiple languages support, contact form, simple blog/projects pages with static data and opportunity to host it on a simple php shared-hosting.

## Preview
<p align="center">
  <img src="client/demo/4e44f8dd6167f7daf284002a6421e8387a2f9345.gif" width="auto" height="250">
  <img src="client/demo/620d4529064cc7f8d27293abf4d4b119517e3cb0.gif" width="auto" height="250">
</p>

## How to run
1. Open your terminal in `client` folder<br/>
2. Run `npm install`<br/>
3. Run `npm run start` to start debugging in your browser. Replace "start" to `dev` to make a dev build or `build` to make a production build (build folder is "dist").<br/>

## Notes and features
* **SPA**. It's single page application with routing based on vanilla js and history api.
* **No DB**. This client actually not using server and database for getting data. I used simple json files as data storage.<br/>
* **Webpack**. I used webpack for compiling, optimizing and testing project.
* **Additional libraries**. [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/), [Parallax.js](https://matthew.wagerfield.com/parallax/), [Animate.css](https://animate.style/). I decided to add those libraries to project so that it would not be too boring.
* **Emails**. Project included simple php script to send mails.
* **Multiple Languages**. Contains multi languages support.
* **Shared-Hosting**. For upload similar project on php shared-hosting you may need .htaccess file to force routing work correctly. It looks like this:<br/>
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
## Todos
As it's just a learning project I don't see a sense to expand it. Maybe I would update project with some code fixes/optimizations.<br/>

