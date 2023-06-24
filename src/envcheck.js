require("dotenv").config();

const requiredEnvVariables = [
    "CFKEY",
    "INFLUXDB_TOKEN",
    "INFLUXDB_URL",
    "INFLUXDB_ORG",
    "INFLUXDB_BUCKET",
    "CRON_SCHEDULE",
];

let envok = true;

requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`No ${envVar} provided!`);
        envok = false;
    }
});

if (!envok) {
    process.exit(1);
}
