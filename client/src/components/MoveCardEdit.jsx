import { useEffect, useState } from 'preact/hooks';
import React from 'react'

const maximumDices = 10;

export default function MoveCardEdit() {
  const [moveName, setMoveName] = useState("");
  const [armorClass, setArmorClass] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [addingAttack, setAddingAttack] = useState(false);
  const [selectedDices, setSelectedDices] = useState([]);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [averageDamage, setAverageDamage] = useState(0)

  useEffect(() => {
  
    if(selectedAttacks.lenth < 1) return;
    let attackDice = 20;

    let chance = (Math.min(attackDice - (armorClass - bonus - 1), 20)) / 20;
    console.log("CHANCES", (chance * 100).toFixed(2) + "%");

    let averageTotalDamage = 0;
    selectedAttacks.forEach((attack) => {
      let averageAttackDamage = attack.reduce((agg, dice) => {
        let averageDice = ((dice * (dice + 1)) / 2) / dice;
        return agg + averageDice;
      }, 0);
      averageTotalDamage += (averageAttackDamage * chance);
    });
    
    setAverageDamage(averageTotalDamage.toFixed(2));

  }, [armorClass, bonus, selectedAttacks])
  








  const handleOnChange = (event) => setMoveName(event.target.value);
  
  const handleCloseDices = () => {
    setAddingAttack(false);
    setSelectedDices([]);
  }

  const handleDiceClick = (diceNumber) => {
    if(selectedDices.length >= maximumDices) return
    setSelectedDices((prev) => [...prev, diceNumber])
  }
  
  const handleSelectedDices = () => {
    if(selectedDices.length < 1) return;
    console.log(selectedDices, selectedAttacks);
    setSelectedAttacks((prev) => [...prev, selectedDices]);
    setAddingAttack(false);
    setSelectedDices([]);
  }



  const diceNumbers = [4,6,8,10,12,20];

  return (
    <div className="w-full max-w-[800px] bg-blue-400 p-4 rounded-md">
      <input
        className="input w-full px-2 mb-5 rounded-sm"
        onChange={handleOnChange}
        placeholder="Nombre de la jugada"
        value={moveName}
      />
      <div className='flex justify-around'>
        <div className='flex gap-2'>
          <p>CA:</p>
          <input 
            className="caInput w-8 rounded-sm flex flex-center text-center "
            maxLength={2}
            value={armorClass}
            placeholder={0}
            onChange={(e) => setArmorClass(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <p>Bonificador:</p>
          <input 
            className="bonusInput w-8 rounded-sm flex flex-center text-center"
            maxLength={2}
            value={bonus}
            placeholder={0}
            onChange={(e) => setBonus(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full h-28 mt-2 flex justify-center items-center">
        {
          addingAttack ? (
            <div class="w-[400px] m-auto">
              <div className="flex justify-end w-full">
                <button className="flex justify-center py-1 px-2 rounded-md" onclick={handleCloseDices}>
                  X
                </button>
              </div>
              <div>
                <div className={`flex justify-center gap-3 px-10 mt-2 `}>
                  {diceNumbers.map((diceNumber, index) => (
                    <button 
                      className="bg-white rounded-md py-1 px-3 font-bold border border-slate-800 w-14"
                      onclick={() => handleDiceClick(diceNumber)}
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
              <button className={`px-2 py-1 rounded-md bg-white `} onClick={() => setAddingAttack(true)}>Añadir Ataque</button>
            </div>
          )
        }
      </div>

      {/*  ATAQUES  */}
      <div className="w-full flex gap-1 mt-5">
        <div className="grow flex gap-3">
          {
            selectedDices.map((selectedDice) => (
              <span className='bg-white text-xs rounded-full flex items-center justify-center px-3'>{selectedDice}</span>
            ))
          }
        </div>
        <div>
          <button className={"flex text-green-800 bg-green-300 justify-center py-1 px-2 rounded-md "+ (selectedDices.length < 1 ? "invisible" : "")} onclick={handleSelectedDices}>
            Seleccionar
          </button>
        </div>
      </div>
      {/*  DMG  */}
      <div className="w-full flex justify-between">
          <div className="text-center">
            <p>Daño medio</p>
            <p className="text-xl">{averageDamage}</p>
          </div>
          <div>

          </div>
      </div>
      {/* Historico de ataques */}
      <div className="px-1 flex flex-col gap-2 pt-4">
        {
          selectedAttacks.map((attack, index) => (
            <>
              <div key={index} class="flex gap-3 w-full items-center py-2 px-2 bg-blue-200 rounded-sm">
               {
                  attack.map((dice, subIndex) => (
                    <span key={subIndex} className='bg-white text-xs rounded-full flex items-center justify-center px-3'>{dice}</span>
                  ))
                }
              </div>
            </>
          ))
        }
      </div>
    </div>
  )
}
