var context = require.context('./test', true, /.+Spec\.tsx?$/);
context.keys().forEach(context);
