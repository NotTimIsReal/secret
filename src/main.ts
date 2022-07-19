import color from "cli-color";
import prompt from "prompts";
import puppeteer from "puppeteer";
console.log("Secret CLI V1");
console.log("Created by me");
let name: string;
let password: string;
let url: string;
async function getPrompts() {
  name = (
    await prompt({
      type: "text",
      name: "name",
      message: color.green("What is your name?"),
    })
  ).name;
  password = (
    await prompt({
      type: "password",
      name: "password",
      message: color.yellow("What is your password?"),
    })
  ).password;
  url = (
    await prompt({
      type: "text",
      name: "url",
      message: color.blue("What is the mathpathways url?"),
    })
  ).url;
}
function random1To30() {
  return Math.floor(Math.random() * 30) + 1;
}
async function main() {
  await getPrompts();
  console.log(
    color.cyan(
      `Hello ${name}, launching browser now... (might take a while on first load)`
    )
  );
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  const res = await page.goto(url);
  if (!res || !res.ok) {
    console.log(color.red("Error: Could not load page"));
    return;
  }
  console.log(color.cyan("Loading page..."));
  //wait 1 second
  //list all the elements in div with class "class-login-body"
  //sleep 1 second
  await page.waitForSelector(".class-login-body");
  const loginBody = await page.$$(".class-login-body");
  if (loginBody.length === 0) {
    console.log(color.red("Error: Could not find login body"));
    return;
  }
  //loop through all the elements looking for a span in them
  //if we find one, click it
  await new Promise((resolve) => setTimeout(resolve, 100));
  for (const element of loginBody) {
    const u = await element.$("user-box-component");
    const div = await u?.$("div");
    const span = await div?.$("span");
    //check if content in span matches name
    const content = await span?.evaluate((e) => e.innerText);
    console.log(content);
    if (content === name) {
      await span?.click();
      break;
    }
  }
  (await page.$("input[name=password]"))?.type(password);
  (await page.$("button[type=submit]"))?.click();
  (await page.waitForSelector("div.circle.allowed"))?.click();
  console.log("Logged in...Choose a module, (DONT CLICK START)");
  (await page.waitForSelector("span.mv3.ng-star-inserted"))?.click();
  let done = false;
  while (!done) {
    const finishbutton = await page.$("div#finishButton");
    if (finishbutton) {
      finishbutton.click();
      done = true;
    }
    const answerbutton = await page.waitForSelector(
      "div.relative.check-button"
    );
    await new Promise((resolve) => setTimeout(resolve, 1000 * random1To30()));
    await answerbutton?.click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const next = await page.$("div.next-button");
    if (next) {
      next?.click();
    }
  }
}
main();
