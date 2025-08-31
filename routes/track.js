const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL;

const detectFeedingEvent = async ({ logs, weight }) => {
  const twoPrior = [];
  for await (const doc of logs.find().sort({ timestamp: -1 }).limit(2)) {
    twoPrior.push(doc);
  }

  if (twoPrior.length !== 2) {
    return false;
  }
  if (twoPrior[0].isFeedingEvent === true) {
    return false;
  }
  const largestWeight = Math.max(
    twoPrior[0]?.weight || 0,
    twoPrior[1]?.weight || 0
  );
  return largestWeight - weight >= 5;
};

const getTimeSinceLastFeedingEvent = async ({ logs }) => {
  const lastFeedingEvent = await logs
    .find({ isFeedingEvent: true })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();
  if (!lastFeedingEvent[0]) {
    return null;
  }
  return Date.now() - lastFeedingEvent[0].timestamp;
};

async function trackRoute({ weight, timestamp }) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("default");
    const logs = database.collection("logs");

    const isFeedingEvent = await detectFeedingEvent({ logs, weight });

    const timeSinceLastFeedingEvent = await (isFeedingEvent === true
      ? null
      : getTimeSinceLastFeedingEvent({
          logs,
        }));

    if (timeSinceLastFeedingEvent) {
      console.log(
        `Time since last feeding event: ${Math.round(
          timeSinceLastFeedingEvent / (1000 * 60)
        )} minutes`
      );
      // TODO email if severe
    }

    const result = await logs.insertOne({
      weight: parseInt(weight),
      timestamp,
      isFeedingEvent,
    });
    const response = `New log entry created with the following id: ${result.insertedId}`;
    console.log(response);

    return response;
  } finally {
    await client.close();
  }
}

module.exports.trackRoute = trackRoute;
