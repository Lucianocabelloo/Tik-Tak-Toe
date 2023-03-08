import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';


const App = () => {

  // Ficha que iran dentro de la casilla
  const Fichas = {
    x: "❌",
    o: "⚪"
  }

  // Combinaciones que al realizarlas darian ganador
  const Combinaciones = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  // Estado del Tablero
    const [Board, setBoard] = useState(Array(9).fill(null))
  // Estado de Turno de cada jugador
    const [Turns, setTurns] = useState(Fichas.x)
  // Estado de ganador, Null no hay ganador, true hay ganador, false empate
    const [Winner, setWinner] = useState(null)
    
    const [Results, setResults] = useState([])
  // Tablero de juego
  const Square = ({children, updateBoard, index, isSelected }) => {
    // Esta Constante va a marcar el turno de quien es, es puramente visual
    const TurnoElegido = `square ${isSelected  ?'is-selected' : ''}`
    const handleClick = () => {
      //Actualizar el board usando el indice
      updateBoard(index)
    }

    return(
      //Cuando se apriete en el div, se llamara a la funcion handleclick, que actualizara el board
      <div onClick={handleClick} className={TurnoElegido}>
        {children}
      </div>
    )
  }
  //Al clickear en cualquier parte del tablero se tiene que actualizar para mostrar los cambios
  const updateBoard = (index) =>{

  

    //Si hay algo en el indice del board, o hay un ganador, se termina la funcion ahi con el return
    if(Board[index] || Winner) 
    return
    
    //Se hace una funcion que se llama nuevo tablero, usando el tablero, ya que no podemos cambiar un estado
    
    const newBoard = [...Board]
    //El nuevo tablero utilizara el indice, y eso sera el turno actual, de esa forma newturn analizara el tablero que se tenga en ese momento
    
    newBoard[index] = Turns
    //Se setea el board haciendo que el nuevo tablero, sea el tablero actual
    setBoard(newBoard)
    
    // Si el turno es de la ficha x, el newturn sera de fichas.o, si no, sera fichas x
    const newTurn = Turns === Fichas.x ? Fichas.o : Fichas.x
    //Se setea el turno con el nuevo turno, de forma que cada vez que se updatee el board, se cambie el turno
    setTurns(newTurn)
    
    // checkear si hay un win
    
    const checkWinner = (BoardToCheck ) => {
  //Se recorre el array combianaciones, y se crea una const que se llama win
      for(const Win of Combinaciones) {
        // La constante win tomara las 3 posiciones de los objetos dentro del array
        const [a, b, c] = Win
        // Si en el board coinciden el 1 con el segundo y el 1 con el 3, significa que hay un ganador
        if(
          BoardToCheck[a] &&
          BoardToCheck[a] === BoardToCheck[b] &&
          BoardToCheck[a] === BoardToCheck[c]
        ){
          return BoardToCheck[a]
        }
      }
      // En caso de que no haya ganador se retorna un null
        return null
    }
   
 const checkedEndGame = (newBoard) =>{
  return newBoard.every((Square) => Square !== null)
 }


 
    // Vemos el tablero actualizado
    const newWinner = checkWinner(newBoard)
    //Si tenemos un nuevo ganador que cumple las combinaciones, se setea el
    if (newWinner) {
      
      toast.info('🦄 De donde se le sube la dificultad', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      confetti()
      
      setWinner(newWinner)   
      
      setResults(...Results, newWinner)
      console.log(Results)
    }
    else if (checkedEndGame(newBoard)) {
      setWinner(false)
      setResults(Winner)
      toast.info('🦄 Que malos son los dos!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        
    }

  }

  const resetGame = () =>{
    setBoard(Array(9).fill(null)),
    setTurns(Fichas.x),
    setWinner(null)
  }

  
  
  return (
    <main className='board'>
      <h1>Ta Te Ti</h1>
      <section className='game'>
        {Board.map((_, index) => {
          return (
            <Square
            key={index}
            index={index}
            updateBoard={updateBoard} >
              {Board[index]}
            </Square>
          )
        })}
      </section>
      <section className='turn'>
        <Square isSelected={Turns === Fichas.x} >
          {Fichas.x}
        </Square>

        <Square isSelected={Turns === Fichas.o}>
          {Fichas.o}
        </Square>
        <button onClick={resetGame}>Volver a jugar</button>
      </section>

     {
      Winner !== null && (
        <section className='winner'>
          <div className='text'>
            <h2>{
              Winner === false
              ? 'Empate'
              : 'Gano'
              }</h2>
            
            <header>
              {Winner && <Square>{Winner}</Square>}
              <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
            </header>

            <footer>
              <button onClick={resetGame}>Volver a jugar</button>
            </footer>
          </div>
        </section>
      )
      
     }


    </main>
  )
}

export default App