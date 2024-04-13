import React from "react";

export default function MoveStats({handleOnChange, moveName, armorClass, setArmorClass, bonusAttack, setBonusAttack, bonusDamage, setBonusDamage}) {
  return (
    <>
      <input
        className="input w-full h-8 px-2 mb-5 rounded-sm border border-1 text-gray-800"
        onChange={handleOnChange}
        placeholder="Nombre de la jugada"
        value={moveName}
      />
      <div className="flex justify-around gap-3 text-center">
        <div className="flex-1 gap-2 p-3 rounded-md bg-cyan-600/30">
          <label htmlFor="caInput">CA Enemigo:</label>
          <input
            id="caInput"
            className=" rounded-sm w-full flex flex-center text-center "
            maxLength={2}
            value={armorClass}
            placeholder={0}
            onChange={(e) => setArmorClass(e.target.value)}
          />
        </div>
        <div className="flex-1 gap-2 p-3 rounded-md bg-cyan-600/30">
          <label htmlFor="bonusAttackInput">Bonificador Ataque:</label>
          <input
            id="bonusAttackInput"
            className=" rounded-sm w-full flex flex-center text-center"
            maxLength={2}
            value={bonusAttack}
            placeholder={0}
            onChange={(e) => setBonusAttack(e.target.value)}
          />
        </div>
        <div className="flex-1 gap-2 p-3 rounded-md bg-cyan-600/30">
          <label htmlFor="bonusDamageInput">Bonificador Daño:</label>
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
    </>
  );
}
