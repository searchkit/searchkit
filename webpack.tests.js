var context = require.context('./src', true, /.+(Spec|\.unit)\.tsx?$/);
context.keys().forEach(context);
