import GlobalLayout from './layouts/GlobalLayout'
import MoveCardEdit from './components/MoveCardEdit'
import { useState } from 'react';

function App() {
  
  const [cards, setCards] = useState([{initialArmorClass: 0, initialBonusAttack: 0, initialBonusDamage: 0}]);

  const copyCard = (stats, idx) => {
    setCards([...cards, {initialArmorClass: stats.armorClass, initialBonusAttack: stats.bonusAttack, initialBonusDamage: stats.bonusDamage}])
  }
  
  return (
    <GlobalLayout>
      <div className="flex flex-wrap gap-y-8 gap-x-6 mt-9 justify-center">
        {
          cards.map((card, index) => (
            <MoveCardEdit key={index} idx={index} initialStats={card} copyCard={copyCard} />
          ))
        }

      </div>
    </GlobalLayout>
  )
}

export default App;