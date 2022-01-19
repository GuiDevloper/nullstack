const PuppeteerEnvironment = require('jest-environment-puppeteer');

class TestEnvironment extends PuppeteerEnvironment {

  async closePages() {
    const pages = (await this.global.browser.pages()).slice(1);
    for (const p of pages) {
      await p.close();
    }
  }

  async teardown() {
    await this.closePages();
    await super.teardown();
  }

}

module.exports = TestEnvironment;