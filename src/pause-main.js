import './styles.css'
import FullscreenPause from './FullscreenPause.svelte'

const app = new FullscreenPause({
  target: document.getElementById('pause-app'),
  props: {
    config: window.pauseConfig || {},
  },
})

export default app
