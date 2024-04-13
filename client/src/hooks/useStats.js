import { useState } from "react";



export default function useAttacks() {
  const [armorClass, setArmorClass] = useState(0);      // CA
  const [bonusAttack, setBonusAttack] = useState(0)     // Bonificador
  const [bonusDamage, setBonusDamage] = useState(0);    // Bonificador DMG
  
  const [moveName, setMoveName] = useState("");
  const handleOnChange = (event) => setMoveName(event.target.value);


  return {handleOnChange, moveName, armorClass, setArmorClass, bonusAttack, setBonusAttack, bonusDamage, setBonusDamage};
}