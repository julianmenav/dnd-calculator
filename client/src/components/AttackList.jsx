import React from 'react'
import attackProperties from '../assets/attackProperties.json';

export default function AttackList({attacks, toggleProperty, deleteAttack}) {
  return (
    <div className="px-1 flex flex-col gap-2 pt-4">
    {
      attacks.map((attack, index) => (
          <div key={index} className=''>
            <div className="flex flex-grow w-full items-center py-2 px-2 bg-blue-200 rounded-sm">
                <div className="grow flex gap-2">
                  {
                    attackProperties.map((property, subIndex) => (
                      <button key={subIndex} className={`border border-1 border-gray-600 text-xs p-2 rounded-md ${attack[property.name] ? "bg-green-200" : ""}`} onClick={() => toggleProperty(property.name, index)}>
                        <span >{property.display}</span>
                      </button>
                    ))
                  }
                </div>
                <div>
                  <button className="text-xs p-2 bg-red-300 rounded-md text-red-700 font-bold " onClick={() => deleteAttack(index)}>
                    <span >x</span>
                  </button>
                </div>
            </div>
            <div className="flex w-full items-center py-2 px-2 bg-blue-200 rounded-sm">
              <div className="flex gap-2 grow">
                {
                  attack.attacks.map((dice, subIndex) => (
                    <span key={subIndex} className='bg-white text-xs rounded-full flex items-center justify-center px-3'>{dice}</span>
                  ))
                }
              </div>
            </div>
          </div>
      ))
    }
    </div>
  )
}
