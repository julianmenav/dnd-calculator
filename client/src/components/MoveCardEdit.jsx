import {useState, useEffect } from 'react'
import React from 'react'

const attackDice = 20;
const maximumDices = 10;
const diceNumbers = [4,6,8,10,12,20];

export default function MoveCardEdit() {
  const [moveName, setMoveName] = useState("");
  const [armorClass, setArmorClass] = useState(0);
  const [bonusAttack, setBonusAttack] = useState(0)
  const [bonusDamage, setBonusDamage] = useState(0);
  const [addingAttack, setAddingAttack] = useState(false);
  const [selectedDices, setSelectedDices] = useState([]);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [averageDamage, setAverageDamage] = useState(0);

  useEffect(() => {
  
    if(selectedAttacks.lenth < 1) return;

    let chance = (Math.min(attackDice - (armorClass - bonusAttack - 1), 20)) / 20;
    console.log("CHANCES", (chance * 100).toFixed(2) + "%");

    let averageTotalDamage = 0;
    selectedAttacks.forEach((attack) => {
      let averageAttackDamage = attack.reduce((agg, dice) => {
        let averageDice = ((dice * (dice + 1)) / 2) / dice;
        return agg + averageDice;
      }, 0);
      console.log(bonusDamage, averageAttackDamage, bonusDamage + averageAttackDamage);
      averageTotalDamage += ((parseFloat(averageAttackDamage) + parseFloat(bonusDamage)) * chance);
    });
    
    setAverageDamage(averageTotalDamage.toFixed(2));

  }, [armorClass, bonusAttack, bonusDamage, selectedAttacks])
  
  const handleOnChange = (event) => setMoveName(event.target.value);
  
  const handleCloseDices = () => {
    setAddingAttack(false);
    setSelectedDices([]);
  }

  const handleDiceClick = (diceNumber) => {
    if(selectedDices.length >= maximumDices) return
    setSelectedDices((prev) => [...prev, diceNumber])
    console.log(diceNumber);
  }
  
  const handleSelectedDices = () => {
    if(selectedDices.length < 1) return;
    console.log(selectedDices, selectedAttacks);
    setSelectedAttacks((prev) => [...prev, selectedDices]);
    setAddingAttack(false);
    setSelectedDices([]);
  }

  const deleteAttack = (index) => {
    let attacks = [...selectedAttacks];
    attacks.splice(index, 1);
    setSelectedAttacks(attacks);
  }

  return (
    <div className="w-full max-w-[800px] bg-white p-4 rounded-md shadow-md text-gray-600">
      <input
        className="input w-full h-8 px-2 mb-5 rounded-sm border border-1 text-gray-800"
        onChange={handleOnChange}
        placeholder="Nombre de la jugada"
        value={moveName}
      />
      <div className='flex justify-around gap-3 text-center'>
        <div className='flex-1 gap-2 p-3 rounded-md bg-cyan-600/30'>
          <label for="caInput">CA Enemigo:</label>
          <input
            id="caInput" 
            className=" rounded-sm w-full flex flex-center text-center "
            maxLength={2}
            value={armorClass}
            placeholder={0}
            onChange={(e) => setArmorClass(e.target.value)}
          />
        </div>
        <div className='flex-1 gap-2 p-3 rounded-md bg-cyan-600/30'>
          <label for="bonusAttackInput">Bonificador Ataque:</label>
          <input
            id="bonusAttackInput"
            className=" rounded-sm w-full flex flex-center text-center"
            maxLength={2}
            value={bonusAttack}
            placeholder={0}
            onChange={(e) => setBonusAttack(e.target.value)}
          />
        </div>
        <div className='flex-1 gap-2 p-3 rounded-md bg-cyan-600/30'>
          <label for="bonusDamageInput">Bonificador Daño:</label>
          <input
            id="bonusDamageInput"
            className=" rounded-sm w-full flex flex-center text-center"
            maxLength={2}
            value={bonusDamage}
            placeholder={0}
            onChange={(e) => setBonusDamage(e.target.value)}
          />
        </div>
      </div>
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

      {/*  ATAQUES  */}
      <div className="w-full flex gap-1 mt-5">
        <div className="grow flex gap-3">
          {
            selectedDices.map((selectedDice) => (
              <span className='bg-blue-300 text-xs rounded-full flex items-center justify-center px-3'>{selectedDice}</span>
            ))
          }
        </div>
        <div>
          <button className={"flex text-green-800 bg-green-300 justify-center py-1 px-2 rounded-md "+ (selectedDices.length < 1 ? "invisible" : "")} onClick={handleSelectedDices}>
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
              <div key={index} className="flex flex-grow w-full items-center py-2 px-2 bg-blue-200 rounded-sm">
                <div className="flex gap-2 grow">
                  {
                      attack.map((dice, subIndex) => (
                        <span key={subIndex} className='bg-white text-xs rounded-full flex items-center justify-center px-3'>{dice}</span>
                      ))
                    }
                </div>
                <div>
                  <button onClick={() => deleteAttack(index)}>
                    <span className="text-xs">x</span>
                  </button>
                </div>
              </div>
            </>
          ))
        }
      </div>
    </div>
  )
}
