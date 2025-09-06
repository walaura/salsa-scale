import { isFeedingEvent } from "../app/feedingEvent.ts";
import { getAllData } from "../app/getData.ts";

async function backtestFeedingEventRoute() {
  const all = await getAllData({
    daysToFetch: 2,
  });

  let results = [];

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

    if (shouldBeFeedingEvent != wasFeedingEvent) {
      returnable += `<a href="#${point._id}" id=${point._id} style='color: red'>MISMATCH</a><br/> `;
      returnable += point.feedingEventOfSize ? "was ✅" : "was ❌";
      returnable += point.feedingEventOfSize && `(${point.feedingEventOfSize})`;
      returnable += shouldBeFeedingEvent ? " will ✅" : " will ❌";
      returnable += shouldBeSize && `(${shouldBeSize})`;
      returnable += `<strong> - ${point.weight} - </strong>`;
      returnable += `${sixNextPoints.join(",")}`;
      returnable += `<br/>${new Date(point.timestamp).toISOString()}`;
    }

    results.push(returnable);
  }

  return results.join("<hr/>");
}

export default backtestFeedingEventRoute;
