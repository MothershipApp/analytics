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

Implement your events like so:

```javascript
window.MothershipAnalytics.newEvent("experienceKey", "eventKey", 10);
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
