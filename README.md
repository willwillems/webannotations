# Web Annotations Demo

A simple `docker-compose` based app to query and display [Web Annotations](https://www.w3.org/TR/annotation-model/).

There are three main components to this app:
- [Typesense](https://typesense.org/): Self-hosted alternative to Algolia and ElasticSearch
- [Nginx](https://www.nginx.com/): Server and reverse proxy
- [uhtml](https://webreflection.github.io/uhtml/) based web-app

You might not be familiar with `uhtml`. It's a tiny library to render HTML. It also suports [signals](https://github.com/preactjs/signals).

There is no install or build step involved in the front end. Everything is loaded from CDN's as ES modules.

## Setup

The setup for this project is as simple as possible. You need to have Docker installed, the Typesense server needs to be configured (see: `./typesense/README.md`), and the right environment variables need to be available (see: `.env.example`).
