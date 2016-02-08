import Quantizer from 'components/quantizer'
import {render} from 'utils/test'
import fixture from './image.svg'

const fakeWorker = jasmine.createSpyObj('worker', ['addEventListener', 'postMessage'])

describe('Quantizer', function () {
  beforeEach(function () {
    spyOn(window, 'Worker').and.returnValue(fakeWorker)
  })

  describe('without any properties', function () {
    beforeEach(function () {
      this.element = render(<Quantizer load />)
    })

    it('is hidden', function () {
      expect(this.element).toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-quantizer')
    })

    it('does not start a worker', function () {
      expect(window.Worker).not.toHaveBeenCalled()
    })
  })

  describe('with basic properties but without an image or a palette', function () {
    beforeEach(function () {
      this.element = render(<Quantizer load samplefac={1} netsize={16} />)
    })

    it('is hidden', function () {
      expect(this.element).toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-quantizer')
    })

    it('does not start a worker', function () {
      expect(window.Worker).not.toHaveBeenCalled()
    })
  })

  describe('with basic properties and an image but without a palette', function () {
    beforeEach(function (done) {
      const img = document.createElement('img')
      img.onload = () => {
        this.element = render(<Quantizer load format='hex' samplefac={1} netsize={16} image={img} />)
        done()
      }
      img.src = fixture
    })

    it('is hidden', function () {
      expect(this.element).toHaveClass('hidden')
    })

    it('renders with the correct class name', function () {
      expect(this.element).toHaveClass('app-quantizer')
    })

    it('starts a worker', function () {
      expect(window.Worker).toHaveBeenCalled()
    })

    it('adds a listener to the worker', function () {
      expect(fakeWorker.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function))
    })

    it('posts a message to the worker', function () {
      expect(fakeWorker.postMessage).toHaveBeenCalledWith(jasmine.objectContaining({
        pixels: jasmine.any(Uint8ClampedArray),
        samplefac: 1,
        netsize: 16
      }))
    })
  })
})
