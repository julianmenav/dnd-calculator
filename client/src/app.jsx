import GlobalLayout from './layouts/GlobalLayout'
import MoveCardEdit from './components/MoveCardEdit'

function App() {


  return (
    <GlobalLayout>
      <div className="flex flex-wrap gap-y-8 gap-x-6 mt-9 justify-center">
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
      </div>
    </GlobalLayout>
  )
}

export default App;