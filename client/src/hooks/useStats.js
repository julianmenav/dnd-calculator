import { useState } from "react";



export default function useAttacks({initialArmorClass, initialBonusAttack, initialBonusDamage}) {

  const [armorClass, setArmorClass] = useState(initialArmorClass);      // CA
  const [bonusAttack, setBonusAttack] = useState(initialBonusAttack)     // Bonificador
  const [bonusDamage, setBonusDamage] = useState(initialBonusDamage);    // Bonificador DMG
  
  const [moveName, setMoveName] = useState("");
  const handleOnChange = (event) => setMoveName(event.target.value);


  return {handleOnChange, moveName, armorClass, setArmorClass, bonusAttack, setBonusAttack, bonusDamage, setBonusDamage};
}