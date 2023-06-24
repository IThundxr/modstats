# Modstats <> Influxdb

This is a quick little docker image that lets you easily get a mods stats from curseforge and modrinth and send them to a influxdb instance.

## How to use

[Docker Compose](docker-compose.yaml)

edit the environment variables and start the container once and stop it then find the directory that was created and go into the config.json and fill it out with the mods you want to track and start it up again!

Your done! now it will send stats to your influxdb instance that you defined in your config

***How often does it send stats?***
It sends the stats using `node-cron` so whatever you've set the cron schedule env to it will follow