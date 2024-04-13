import React from 'react'


const diceNumbers = [4,6,8,10,12,20];

export default function DiceSelector({addingAttack, setAddingAttack, handleCloseDices, handleDiceClick, selectedDices, handleAddAttack }) {
  return (
    <>
    <div className="w-full h-28 mt-2 flex justify-center items-center">
    {
      addingAttack ? (
        <div className="w-[400px] m-auto">
          <div className="flex justify-end w-full">
            <button className="flex justify-center py-1 px-2 rounded-md" onClick={handleCloseDices}>
              X
            </button>
          </div>
          <div>
            <div className={`flex justify-center gap-3 px-10 mt-2 `}>
              {diceNumbers.map((diceNumber, index) => (
                <button 
                  className="bg-white rounded-md py-1 px-3 font-bold border border-slate-800 w-14"
                  onClick={() => handleDiceClick(diceNumber)}
                  key={index}
                >
                  {diceNumber}
                </button>
              ))}
            </div>
            <div className="w-full">

            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <button className={`px-2 py-1 rounded-md bg-zinc-300 shadow-sm hover:`} onClick={() => setAddingAttack(true)}>Añadir Ataque</button>
        </div>
      )
    }
  </div>
  <div className="w-full flex gap-1 mt-5">
    <div className="grow flex gap-3">
      {
        selectedDices.map((selectedDice, index) => (
          <span key={index} className='bg-blue-300 text-xs rounded-full flex items-center justify-center px-3'>{selectedDice}</span>
        ))
      }
    </div>
    <div>
      <button className={"flex text-green-800 bg-green-300 justify-center py-1 px-2 rounded-md "+ (selectedDices.length < 1 ? "invisible" : "")} onClick={handleAddAttack}>
        Seleccionar
      </button>
    </div>
  </div>
  </>
  )
}
