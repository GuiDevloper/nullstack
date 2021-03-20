import Nullstack from 'nullstack';

class RenderableComponent extends Nullstack {

  renderNestedInnerComponent() {
    return <div data-nested />
  }

  renderInnerComponent({children}) {
    return (
      <div class="InnerComponent">
        <p> Inner Component </p>
        <NestedInnerComponent />
        {children}
      </div>
    )
  }

  renderFalsy() {
    return false;
  }
  
  render({params}) {
    const { condition, shortList } = JSON.parse(params.devData || '{}');
    const list = shortList ? [1,2,3] : [1, 2, 3, 4, 5, 6]
    const html = '<a href="/"> Nullstack </a>';
    // http://localhost:6969/?devData={%22shortList%22:false,%22condition%22:{%22gato%22:%22true%20da%20true%20meu%20camarada%22}}
    return (
      <div class="RenderableComponent">
        <Falsy />
        <div data-object={{a: 1}} />
        <div data-function={RenderableComponent} />
        <div> this is a normal tag </div>
        <label for="input"> label </label>
        <button disabled> disabled botao </button>
        <button class="conditionally-disabled" disabled={!!condition}>
          conditionally disabled button
        </button>
        <element class="element" tag={condition ? 'div' : 'span'}>
          { condition?.gato }
        </element>
        <InnerComponent> 
          <span class="children"> children </span>
        </InnerComponent>
        <ul>
          {list.map((item) => <li> {item} </li>)}
        </ul>
        <div html={html} />
        <head>
          <link rel="preload" href="https://nullstack.app" as="fetch" crossorigin />
        </head>
        {!!condition && 
          <div class="condition"> conditionally render </div>
        }
        <a
          href='/?devData={"shortList":true,"condition":{"gato":true}}'
          class="short-list"> long list </a>
        <a
          href='/?devData={"shortList":false,"condition":true}'
          class="true-condition"> long list </a>
        <div data-condition={!!condition} />
        <div data-short-list={!!shortList} />
        <div data-name={this.name} />
      </div>
    )
  }

}

export default RenderableComponent;