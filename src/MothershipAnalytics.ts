let axios = require("axios");
let StackTrace = require("stacktrace-js");

declare global {
  interface Window {
    MothershipConfig: any;
    MothershipAnalytics: any;
  }
}

interface MothershipOptions {
  [option: string]: any;
  mothershipUrl: string; // For testing
  apiKey: string;
}

interface Event {
  experienceKey: string;
  eventKey: string;
  points?: any;
}

export default class MothershipAnalytics {
  private defaultOptions: MothershipOptions = {
    mothershipUrl: "https://mothership.app",
    apiKey: ""
  };

  private eventQueueTimer?: ReturnType<typeof setTimeout>;

  public queuedEvents: Array<Event> = [];

  constructor(public options: MothershipOptions) {
    this.options = Object.assign({}, this.defaultOptions, this.options);
    this.init();
  }

  /**
   * Starts the uncaught error handler listener
   */
  private init(): void {
    window.onbeforeunload = () => {
      clearTimeout(this.eventQueueTimer);
      this.sendEvents();
    };
  }

  set apiKey(value: string) {
    this.options.apiKey = value;
  }

  /**
   * Checks to see if analytics is enabled and if it is
   * sends along the event to Mothership
   *
   * @param experienceKey    Key of the experience (Retrieve from mothership.app)
   * @param eventKey         Key of the event (Retrieve from mothership.app)
   * @param points           Value of the event
   */
  newEvent(experienceKey: string, eventKey: string, points: any = 1) {
    clearTimeout(this.eventQueueTimer);
    this.eventQueueTimer = setTimeout(() => {
      this.sendEvents();
    }, 2000);

    this.queuedEvents.push({
      experienceKey: experienceKey,
      eventKey: eventKey,
      points: points
    });
    return {
      experienceKey: experienceKey,
      eventKey: eventKey,
      points: points
    };
  }

  private sendEvents() {
    if (this.options.apiKey === "") {
      console.warn("Mothership Analytics Error: Please set your apiKey");
    } else if (this.queuedEvents.length > 0) {
      axios
        .post(
          `${this.options.mothershipUrl}/api/v1/analytics/events`,
          {
            events: this.queuedEvents
          },
          {
            headers: {
              Authorization: "Bearer " + this.options.apiKey
            }
          }
        )
        .then(() => {
          // Clear the queue
          this.queuedEvents = [];
        })
        .catch((error: object) => {
          console.error("There was a problem reaching mothership", error);
        });
    }
  }
}
