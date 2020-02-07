const fs = require("fs");

(function readWriteAsync() {
  fs.readFile(`generated/graphql.tsx`, "utf-8", function(err, data) {
    if (err) throw err;

    var newValue = data.replace(/react-hooks/gim, "client");

    fs.writeFile(`generated/graphql.tsx`, newValue, "utf-8", function(err) {
      if (err) throw err;
      console.log("script completed");
    });
  });
})();
