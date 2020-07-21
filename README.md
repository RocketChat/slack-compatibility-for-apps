# Slack Compatibility Layer for Rocket.Chat Apps

Initialize your Rocket.Chat App with bindings that make it compatible with your Slack implementation.

Would you like to have your app listed in [Rocket.Chat's Marketplace](https://rocket.chat/marketplace) but don't want to rewrite all the backend for your Slack listing?

Look no further!

This "compatibility layer" will help you make your Rocket.Chat App talk to your backend in no time :)

Learn more [in our docs](https://docs.rocket.chat/apps-development/slack-compatibility);

## Some documentation about how to develop/extend scl

The moving parts of this scenario

- slack app
- slack workspace
- slack slashcommand
- rocket.chat app (extending the slack comp layer)
- slack compatibility layer (scl, for short)
- rocket.chat server

## First part: rocket.chat app, scl and rocket.chat server

It is good to leave the app and slc in adjacent directories to make updates
easier (see "tips and tricks").

First, you install the scl in the rocket.chat app (can be any app, really) by
running `npm install <scl_directory_path>` inside the app's directory. The
installation process will generate a new `vendor` directory at the app's root
(the magic happens there). Extend the app's main class with scl and we're good
to go.

Having the scl installed in the app, you need to deploy it to your rc server.
by running `rc-apps deploy --url <localhost_etc> -u <user> -p <pwd>`.

The scl will register a new endpoint in the app. We'll need the url later in
the slack app (requests will be pointed to this endpoint).

```
npm install ../../slack-compatibility-for-apps;
rc-apps deploy --url http://localhost:3000 -u thassio -p 123qweasd --update
```

## Second part: slack's app, workspace and slashcommand

The proper configuration of a slack app requires some tokens, but we will only
need an access token for now. It can be found in the apps's page at
[the ok app](https://api.slack.com/apps/A014QAU2NQ0)

We will also need the rocket.chat app's url to configure the slack app

Put the access token and the rc app's url in the `.env` file and run
`npm run dev`. After that, run a reverse proxy app (can be ngrok) to capture
an url to put on the slashcommands configuration. The app runs on port 5000 so
the command will likely be `ngrok http 5000`.

Then go to *the ok app* and put the proxied url in its _slashcommand_
configuration (or create a new slashcommand and then add the url, your choice).

## Results

When you run a slashcommand at slack, it will be sent to the _slack app_ using
the _proxied url_, then it will send a payload back to the _slack workspace_
and to the _rocket.chat app's endpoint_. The payload should be rendered
correctly at both messengers.


## Tips and tricks

When I update the scl, I usually go to the _rc app_ directory and run
`npm install <scl_directory_path>; rc-apps deploy --url <localhost_etc> -u <user> -p <pwd> --update`.
Way easier to do it in only one go.

When extending the rc app's class wih the scl, do
```
[...]
import { SlackCompatibleApp as App } from './vendor/slack-compatible-layer/SlackCompatibleApp';

export class <your_app> extends App {
[...]
```
