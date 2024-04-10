import { useReducer, useState } from 'preact/hooks'
import GlobalLayout from './layouts/GlobalLayout'
import MoveCardEdit from './components/MoveCardEdit'

export function App() {


  return (
    <GlobalLayout>
      <MoveCardEdit />
    </GlobalLayout>
  )
}
