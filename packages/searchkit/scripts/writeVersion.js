if (process.env.BRANCH) {

  const version = process.env.BRANCH.replace('v', '');

  let fs = require("fs")
  let path = require("path")
  fs.writeFileSync(
      path.join(__dirname, "../", "src/core", "SearchkitVersion.ts"),
      `export const VERSION = '${version}'`
  )

}