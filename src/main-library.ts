import MothershipAnalytics from "./MothershipAnalytics";

if (typeof window.MothershipConfig !== "undefined") {
  const options = window.MothershipConfig;
  window.MothershipAnalytics = new MothershipAnalytics(options);
} else {
  console.warn(
    "Mothership: You need to set (at minimum) window.MothershipConfig={ apiKey: xxxxx } "
  );
}
