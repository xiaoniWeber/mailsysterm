import React from 'react'
import ContentEditable from 'react-contenteditable'

type IProps = {
  onHandleContent: (content: string) => void
  onHandleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  smartContent: string
  value?: string
  onRef?: (ref: React.RefObject<HTMLDivElement>) => void
}
class SendBox extends React.Component<IProps> {
  contentEditable: React.RefObject<HTMLDivElement>
  state: { html: string }

  constructor(props) {
    super(props)
    this.contentEditable = React.createRef()
    this.state = { html: '' }
  }
  componentDidMount(): void {
    this.props.onRef && this.props.onRef(this.contentEditable)
  }
  shouldComponentUpdate(nextProps) {
    const ref = this.contentEditable.current as unknown as HTMLDivElement
    return nextProps.value !== ref.innerHTML
  }
  componentDidUpdate() {
    const ref = this.contentEditable.current as unknown as HTMLDivElement
    if (this.props.smartContent !== ref.innerHTML) {
      ref.innerHTML = this.props.smartContent
    }
  }
  handleChange = (evt) => {
    this.setState({ html: evt.target.value })
    this.props.onHandleContent(evt.target.value)
  }
  handleKeyDown = (evt) => {
    this.props.onHandleKeyDown(evt)
  }

  render = () => {
    return (
      <ContentEditable
        innerRef={this.contentEditable as unknown as () => void}
        html={this.state.html} // innerHTML of the editable div
        disabled={false} // use true to disable editing
        onChange={this.handleChange} // handle innerHTML change
        tagName='article' // Use a custom HTML tag (uses a div by default)
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}
export default SendBox
