import reactTools from '../../experience'

const wrapperId = 'wrappedComponent'

function execution () {
  reactTools.onReactReady((React) => {
    class Notice extends React.Component {
      render () {
        return <h2>Replaced</h2>
      }
    }

    const notice = reactTools.registerComponent(wrapperId, Notice)

    setTimeout(notice.dispose, 2000)
  })
}

export default execution
