const glob = require("glob");
const fs = require("fs");

const pages = {};

let entries;
try {
  entries = glob("src/pages/*/main.js", { sync: true });
} catch (err) {
  entries = [];
  throw err;
}

entries.forEach(file => {
  const fileSplit = file.split("/");
  const pageName = fileSplit[2].toLowerCase();
  let pageHtml = fileSplit.slice(0, 3).join("/") + "/index.html";
  if (!fs.existsSync(pageHtml)) {
    pageHtml = "public/index.html";
  }
  pages[pageName] = {
    entry: file,
    template: pageHtml,
    filename: `${pageName}.html`
  };
});

module.exports = pages;
