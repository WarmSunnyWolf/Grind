#!/bin/sh
# Builds the public website (index.html) from src/
cd "$(dirname "$0")"
SRC=src
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns=%%22http://www.w3.org/2000/svg%%22 viewBox=%%220 0 48 48%%22%%3E%%3Cpath d=%%22M24 24l15.5-7.5A17 12 0 1 1 31 9z%%22 fill=%%22%%236f8f4e%%22 stroke=%%22%%2322352a%%22 stroke-width=%%222%%22/%%3E%%3Ccircle cx=%%2233%%22 cy=%%2230%%22 r=%%225.5%%22 fill=%%22%%23e9bcb3%%22 stroke=%%22%%2322352a%%22 stroke-width=%%222%%22/%%3E%%3C/svg%%3E">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  cat $SRC/01-head.html
  printf '</head>\n<body>\n'
  cat $SRC/02-body.html
  printf '<script src="firebase-config.js"></script>\n<script>\n'
  cat $SRC/03-animals.js $SRC/04-core.js $SRC/05-net-web.js $SRC/06-focus.js $SRC/07-pebbles.js $SRC/08-social.js $SRC/09-app.js
  printf '</script>\n</body>\n</html>\n'
} > index.html
