import { isFeedingEvent } from "../app/feedingEvent.ts";
import { getAllData } from "../app/getData.ts";

async function backtestFeedingEventRoute() {
  const all = await getAllData({
    daysToFetch: 1,
  });

  let allResults = [];
  let mismatchResults = [];

  let newPositivesCount = 0;
  let newNegativesCount = 0;

  for (const point of all) {
    const sixNextPoints = all
      .slice(all.indexOf(point) + 1, all.indexOf(point) + 7)
      .map((p) => p.weight);

    let returnable = "";

    const [shouldBeFeedingEvent, shouldBeSize] = isFeedingEvent(
      point.weight,
      sixNextPoints
    );
    const wasFeedingEvent = point.feedingEventOfSize != null;
    if (shouldBeFeedingEvent && !wasFeedingEvent) {
      newPositivesCount++;
    }
    if (!shouldBeFeedingEvent && wasFeedingEvent) {
      newNegativesCount++;
    }

    if (shouldBeFeedingEvent !== wasFeedingEvent) {
      returnable += `<a href="#${point._id}" id=${point._id} style='color: red'>MISMATCH</a><br/> `;
    } else {
      returnable += `<a href="#${point._id}" id=${point._id}>[M]</a> `;
    }
    returnable += point.feedingEventOfSize ? "was ✅" : "was ❌";
    returnable += point.feedingEventOfSize && `(${point.feedingEventOfSize})`;
    returnable += shouldBeFeedingEvent ? " will ✅" : " will ❌";
    returnable += shouldBeSize && `(${shouldBeSize})`;
    returnable += `<strong> - ${point.weight} - </strong>`;
    returnable += `${sixNextPoints.join(",")}`;
    returnable += `<br/>${new Date(point.timestamp).toISOString()}`;

    allResults.push(returnable);
    if (shouldBeFeedingEvent != wasFeedingEvent) {
      mismatchResults.push(returnable);
    }
  }

  const header = /* HTML */ `<p>
      ${newPositivesCount} new positives / ${newNegativesCount} new negatives.
    </p>
    <hr />`;

  return (
    header +
    `<h1>Mismatches</h1>` +
    mismatchResults.join("<hr/>") +
    `<h2>Everything</h2>` +
    allResults.join("<hr/>")
  );
}

export { backtestFeedingEventRoute };
