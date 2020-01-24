;(global as any).requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}
import { configure } from 'enzyme'
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })
