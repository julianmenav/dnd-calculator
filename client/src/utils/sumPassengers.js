export default function sumPassengers(passengerObject) {    
    return Object.keys(passengerObject).reduce((acc, key) => acc + passengerObject[key], 0)
}