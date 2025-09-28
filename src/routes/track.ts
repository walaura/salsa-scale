import { Collection } from "mongodb";
import { EmailEntry, withDb, type LogEntry } from "../app/setup/db.ts";
import {
  isFeedingEvent as isFeedingEventFn,
  maybeMergePreviousFeedingEvent,
} from "../app/feedingEvent.ts";
import { getPreviousFeedingEvents } from "../app/getData.ts";
import { formatGrams } from "../app/format.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { Route } from "@/app/setup/routes.ts";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.improvmx.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

const detectFeedingEventOfSize = async ({
  logs,
  weight,
}: {
  logs: Collection<LogEntry>;
  weight: number;
}): Promise<number | null> => {
  const lastHour = await getPreviousFeedingEvents({ logs });

  if (lastHour.length <= 2) {
    console.log(`Missing events`);
    return null;
  }

  let [isFeedingEvent, tempDelta] = isFeedingEventFn(
    weight,
    lastHour.map((e) => e.weight),
  );

  if (!isFeedingEvent) {
    console.log(
      `Not a feeding event (${weight} - ${lastHour
        .map((e) => e.weight)
        .join(", ")})`,
    );
    return null;
  }

  const [delta, eventsToMerge] = maybeMergePreviousFeedingEvent(
    tempDelta,
    lastHour,
  );

  //clean up the previous ones if they were set
  for (const id of eventsToMerge) {
    await logs.updateOne(
      { _id: id },
      {
        $set: {
          feedingEventOfSize: null,
        },
      },
    );
  }
  console.log(`Marking as feeding event of size ${delta}`);

  return delta;
};

export const trackRoute: Route<"get"> = {
  method: "get",
  path: "/track/" + TOP_SECRET_PATH + "/:weight",
  handler: (req) => {
    const weight = parseInt(req.params.weight);
    const timestamp = Date.now();

    return withDb(async (database) => {
      const logs = database.collection<LogEntry>("logs");
      const emails = database.collection<EmailEntry>("emails");

      const feedingEventOfSize = await detectFeedingEventOfSize({
        logs,
        weight,
      });

      function addHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
      }
      const lastEmailSent = await emails
        .find({})
        .sort({ sentAt: -1 })
        .limit(1)
        .toArray()
        .then((arr) => arr[0]);

      const a = await emails.insertOne({
        weight,
        sentAt: timestamp,
        feedingEventOfSize,
      });

      // 6 hours
      if (
        !(
          addHours(new Date(lastEmailSent.sentAt), 1) < new Date() &&
          weight < 100
        )
      ) {
        const info = await transporter.sendMail({
          from: `"Salsa's Scale" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO,
          subject: "Salsa is starving",
          text: "Salsa is starving, feed the cat",
          html: `
            <b>Salsa is starving, you need to feed the cat</b>
            <br />
            <img src="cid:sadSalsa" alt="Salsa's Scale" />`,
          attachments: [
            {
              filename: "salsa.jpg",
              path: "https://scale.salsashack.co.uk/static/salsa.jpg",
              cid: "sadSalsa",
            },
          ],
        });

        console.log("Message sent:", info.messageId);
        console.log("More than 2 hours since last email");
      }

      // const result = await logs.insertOne({
      //   weight,
      //   timestamp,
      //   feedingEventOfSize,
      // });
      const result = { insertedId: "mocked-id-1234" }; // Mocked result for demonstration
      const response = `New log entry (${formatGrams(
        weight,
      )}) created with the following id: ${result.insertedId}`;

      return response;
    });
  },
};
