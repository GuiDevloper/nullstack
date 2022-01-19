module.exports = async function closePages(done) {
  const pages = (await browser.pages()).slice(1);
  for (const p of pages) {
    await p.close();
  }
  done();
}