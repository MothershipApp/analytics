# Mothership Analytics

## Implementation

### Download Library

Download [mothership-analytics.lib.js](https://raw.githubusercontent.com/MothershipApp/analytics/master/library-dist/mothership-analytics.lib.js) and place it in your javascript directory (the example below we assume it's called "js").

Place the following code in your `<head>`:

```html
<script>
  window.MothershipConfig = {
    apiKey: "XXXXXX"
  };
</script>
<script src="/js/mothership-analytics.lib.js"></script>
```

### Implement your events:

API
```javascript
window.MothershipAnalytics.newEvent(experienceKey, eventKey, pointValue = 1, force = false);
```

Example:
```javascript
window.MothershipAnalytics.newEvent("experienceKey", "eventKey", 10);
```

Keep in mind that an experienceKey/eventKey combination will **only fire one time** per page load unless you pass the force flag. This is to prevent components that you may include multiple times on a page from skewing your results. However, if you *do* want to force a fire (like in a SPA application where the page only really loads one time) you can pass a fourth argument to make that happen.

```javascript
window.MothershipAnalytics.newEvent("experienceKey", "eventKey", 10); // Will report
window.MothershipAnalytics.newEvent("experienceKey", "eventKey", 10); // Will not report
window.MothershipAnalytics.newEvent("experienceKey", "eventKey", 10, true); // Will report
```

## Development and Testing

### Build

```sh
yarn build
```

```sh
npm run build
```

### Development

```sh
yarn serve
```

```sh
npm run serve
```

### Testing

```sh
yarn test
```

```sh
npm run test
```
