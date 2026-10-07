import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("style.css","utf8");
const app=fs.readFileSync("app.js","utf8");
const backend=fs.readFileSync("backend-config.js","utf8");

assert.match(html,/id="lookup-form"/);
assert.match(html,/id="augment-grid"/);
assert.match(html,/id="augment-detail"/);
assert.match(html,/data-period="set"/);
assert.match(html,/data-sort="top4"/);
assert.match(css,/@media\(max-width:680px\)/);
assert.match(css,/focus-visible/);
assert.match(app,/buildAggregate/);
assert.match(app,/partners/);
assert.match(app,/matchesForPeriod/);
assert.match(backend,/riot-legacy-tft-profile/);
assert.ok(fs.existsSync("sobre.html"));
assert.ok(fs.existsSync("privacidade.html"));
assert.ok(fs.existsSync("termos.html"));

console.log("TFT Augment Memory static QA passed");