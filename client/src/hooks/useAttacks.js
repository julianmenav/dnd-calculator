import { useState } from "react";



export default function useAttacks() {
  const [attacks, setAttacks] = useState([]);

  const addAttack = (newAttack) => {
    setAttacks([...attacks, newAttack]);
  };

  const toggleProperty = (propertyName, attackIndex) => {
    setAttacks(attacks.map((attack, index) => {
      if (index === attackIndex) {
        return { ...attack, [propertyName]: !attack[propertyName] };
      }
      return attack;
    }));
  };

  const deleteAttack = (index) => {
    setAttacks(attacks.filter((attack, idx) => {
        return index != idx
    }));
  }

  return { attacks, addAttack, toggleProperty, deleteAttack };
}