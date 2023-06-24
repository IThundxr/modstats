const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const mods = require("./config/config.json");
const cron = require("node-cron");
const checkenv = require("./envcheck");
require("dotenv").config();

// Create InfluxDB client
const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;
const client = new InfluxDB({ url, token });

// Check if all required environment variables are set
checkenv();

// Schedule cron job
cron.schedule(process.env.CRON_SCHEDULE, () => {
    // Iterate over all mods
    mods.forEach(async (mod) => {
        // Get mod name, curseforge ID and modrinth ID
        const modName = mod[0];
        const curseforgeID = mod[1];
        const modrinthID = mod[2];

        // Make request to CurseForge
        const curseforgeRequest = await fetch(
            `https://api.curseforge.com/v1/mods/${curseforgeID}`,
            {
                headers: {
                    "x-api-key": process.env.CFKEY,
                },
            }
        );
        // Make request to Modrinth
        const modrinthRequest = await fetch(
            `https://api.modrinth.com/v2/project/${modrinthID}`
        );

        // Parse JSON data from requests and get download count
        const curseforgeData = await curseforgeRequest.json();
        const curseforgeDownloads = curseforgeData.data.downloadCount;
        const modrinthData = await modrinthRequest.json();
        const modrinthDownloads = modrinthData.downloads;

        // Create a InfluxDB Write API client
        const writeClient = client.getWriteApi(
            process.env.INFLUXDB_ORG,
            process.env.INFLUXDB_BUCKET,
            "ns"
        );

        // Create a new point with the data
        const point = new Point("downloads")
            .tag("modName", modName)
            .intField("curseforgeDownloads", curseforgeDownloads)
            .intField("modrinthDownloads", modrinthDownloads)
            .intField(
                "totalDownloads",
                curseforgeDownloads + modrinthDownloads
            );

        // Write the point to InfluxDB
        writeClient.writePoint(point);

        // Flush the data to InfluxDB
        writeClient.flush();

        // Log the confirmation to the console
        console.log(
            `Data written to InfluxDB for Project ${modName} \nat ${new Date()}`
        );
    });
});
