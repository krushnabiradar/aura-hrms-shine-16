
# Static File Serving Setup

To enable logo uploads and serving, add this to your main app.js file:

```javascript
const { serveStatic } = require('./middleware/static');

// Add this line after other middleware
app.use('/uploads', serveStatic());
```

This will allow uploaded logos to be accessible via `/uploads/filename.ext` URLs.
