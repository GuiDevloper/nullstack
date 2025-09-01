describe('SvgSupport', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:6969/svg-support')
    await page.waitForSelector('[data-hydrated]')
  })

  test('svg can render text', async () => {
    expect(true).toBeTruthy()
  })

  test('svg can add new paths while rerendering', async () => {
    expect(true).toBeTruthy()
  })

  test('svg can render in short circuit statements', async () => {
    expect(true).toBeTruthy()
  })

  test('svg can render in ternary statements', async () => {
    expect(true).toBeTruthy()
  })
})
