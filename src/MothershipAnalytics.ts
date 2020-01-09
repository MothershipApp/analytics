let axios = require("axios");

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

interface AnalyticsEvent {
  experience_key: string;
  event_key: string;
  points?: any;
}

export default class MothershipAnalytics {

  static instance:MothershipAnalytics;
      
  private defaultOptions: MothershipOptions = {
    mothershipUrl: "https://mothership.app",
    apiKey: ""
  };

  private eventQueueTimer?: ReturnType<typeof setTimeout>;

  public queuedEvents: Array<AnalyticsEvent> = [];
  public static eventLog: Array<AnalyticsEvent> = [];

  constructor(public options: MothershipOptions) {
    if(MothershipAnalytics.instance){
      return MothershipAnalytics.instance;
    }

    MothershipAnalytics.instance = this;
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
   * @param experience_key    Key of the experience (Retrieve from mothership.app)
   * @param event_key         Key of the event (Retrieve from mothership.app)
   * @param points           Value of the event
   */
  newEvent(
    experienceKey: string,
    eventKey: string,
    points: any = 1,
    force: boolean = false
  ) {

    if (force === true || this.isUniqueEvent(experienceKey, eventKey)) {
      clearTimeout(this.eventQueueTimer);
      this.eventQueueTimer = setTimeout(() => {
        this.sendEvents();
      }, 2000);

      MothershipAnalytics.eventLog.push({
        experience_key: experienceKey,
        event_key: eventKey,
        points: points
      });
      this.queuedEvents.push({
        experience_key: experienceKey,
        event_key: eventKey,
        points: points
      });
      return true
    }
    return false
  }

  /**
   * Checks to see if the event is unique
   *
   * @param experience_key    Key of the experience
   * @param event_key         Key of the event
   */
  private isUniqueEvent(experienceKey: string, eventKey: string) {
    const foundEvent = MothershipAnalytics.eventLog.find(event => {
      return event.experience_key === experienceKey && event.event_key === eventKey;
    });

    return !foundEvent
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
