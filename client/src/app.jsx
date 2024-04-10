import { useReducer, useState } from 'preact/hooks'
import GlobalLayout from './layouts/GlobalLayout'
import MoveCardEdit from './components/MoveCardEdit'

export function App() {


  return (
    <GlobalLayout>
      <div className="flex flex-wrap gap-y-8 gap-x-6 mt-9 justify-center">
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
        <MoveCardEdit />
      </div>
    </GlobalLayout>
  )
}
