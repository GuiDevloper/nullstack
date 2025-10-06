describe('SvgSupport', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:6969/svg-support')
    await page.waitForSelector('[data-hydrated]')
  })

  test('svg can render text', async () => {
    // Verifica se o SVG possui 4 elementos <text> dentro dele
    const svg = await page.$('svg');
    const texts = await svg.$$('text');
    expect(texts.length).toBe(4);
  })

  test('svg can add new paths while rerendering', async () => {
    // Verifica se o ícone Hamburger está presente inicialmente (3 paths)
    const hamburgerPaths = await page.$$('svg[width="30"] path')
    expect(hamburgerPaths.length).toBe(3) // Hamburger has 3 paths
  })

  test('svg can render in short circuit statements', async () => {
    // Verifica se o ícone de Hamburger está sendo exibido (3 paths)
    const hamburgerPaths = await page.$$('svg[width="30"] path')
    expect(hamburgerPaths.length).toBe(3)
  })

  test('svg can render in ternary statements', async () => {
  let bigHamburger = await page.$('svg[width="69"]')
  expect(bigHamburger).toBeFalsy()

  // Clica no segundo botão (show)
  const buttons = await page.$$('button')
  await buttons[1].click()

  // Aguarda o Hamburger grande aparecer
  await page.waitForSelector('svg[width="69"]')

  // Verifica se o Hamburger foi renderizado no ternário
  bigHamburger = await page.$('svg[width="69"]')
  expect(bigHamburger).toBeTruthy()

  })

  test('icon toggle functionality works correctly', async () => {  
    // Primeiro verifica o estado inicial (deve ser Hamburger, 3 paths)
    let iconPaths = await page.$$('svg[width="30"] path')
    expect(iconPaths.length).toBe(3) // Hamburger tem 3 paths

    // Clica no primeiro botão (toggle)
    const buttons = await page.$$('button')
    await buttons[0].click()

    // Aguarda o ícone trocar (Close tem 2 paths)
    await page.waitForFunction(() => {
      const svg = document.querySelector('svg[width="30"]');
      return svg && svg.querySelectorAll('path').length === 2;
    });

    iconPaths = await page.$$('svg[width="30"] path')
    expect(iconPaths.length).toBe(2) // Close tem 2 paths

    // Clica novamente para voltar ao Hamburger
    await buttons[0].click()

    // Aguarda o ícone trocar de volta (Hamburger tem 3 paths)
    await page.waitForFunction(() => {
      const svg = document.querySelector('svg[width="30"]');
      return svg && svg.querySelectorAll('path').length === 3;
    });

    iconPaths = await page.$$('svg[width="30"] path')
    expect(iconPaths.length).toBe(3) // Hamburger tem 3 paths
  })

  test('icon visibility toggle works correctly', async () => {

    // Verifica que o ícone grande não está visível inicialmente
    let bigHamburger = await page.$('svg[width="69"]')
    expect(bigHamburger).toBeFalsy()

    // Clica no segundo botão (show)
    const buttons = await page.$$('button')
    await buttons[1].click()

    // Aguarda o Hamburger grande aparecer
    await page.waitForSelector('svg[width="69"]')

    // Verifica se o Hamburger grande apareceu
    bigHamburger = await page.$('svg[width="69"]')
    expect(bigHamburger).toBeTruthy()

    // Clica novamente no segundo botão (show) para esconder
    await buttons[1].click()

    // Aguarda o Hamburger grande desaparecer do DOM
    await page.waitForSelector('svg[width="69"]', { hidden: true })

    // Verifica se o Hamburger grande desapareceu
    bigHamburger = await page.$('svg[width="69"]')
    expect(bigHamburger).toBeFalsy()
  })

  test('svg attributes are correctly applied', async () => {
    // Verifica se os atributos SVG estão sendo aplicados corretamente
    const svgElement = await page.$('svg[viewBox="0 0 240 80"]')
    expect(svgElement).toBeTruthy()
    
    const xmlns = await page.$eval('svg[viewBox="0 0 240 80"]', el => el.getAttribute('xmlns'))
    expect(xmlns).toBe('http://www.w3.org/2000/svg')
  })
})
