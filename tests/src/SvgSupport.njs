import Nullstack from 'nullstack';

function Close({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 482 482">
      <path d="M124 124L358 358" stroke="#000" stroke-width="70.2055" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M358 124L124 358" stroke="#000" stroke-width="70.2055" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
}

function Hamburger({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 482 482">
      <path d="M92.5 150H386.5" stroke="#000" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M92.5 241H386.5" stroke="#000" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M92.5 332H386.5" stroke="#000" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
}

class SvgSupport extends Nullstack {

  open = false
  visible = false
  
  render() {
    return (
      <div>
        <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
          <text x="20" y="35" class="small">I</text>
          <text x="40" y="35" class="heavy">love</text>
          <text x="55" y="55" class="small">my</text>
          <text x="60" y="55" class="tiny">cat!</text>
        </svg>
        {this.open ? <Close size={30} /> : <Hamburger size={30} />}
        <button onclick={{open: !this.open}}> toggle </button>
        {this.visible && <Hamburger size={69} />}
        <button onclick={{visible: !this.visible}}> show </button>
      </div>
    )
  }

}

export default SvgSupport;