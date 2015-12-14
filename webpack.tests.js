var context = require.context('./src', true, /.+Spec\.tsx?$/);
context.keys().forEach(context);
