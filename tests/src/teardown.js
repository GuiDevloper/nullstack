module.exports = async function closePages() {
  const pages = (await browser.pages()).slice(1);
  for (const p of pages) {
    await p.close();
  }
}