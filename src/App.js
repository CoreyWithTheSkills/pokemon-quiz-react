import { useState, useEffect } from 'react';
import './App.css';

const easyPokemon = ['pikachu', 'charizard', 'eevee', 'squirtle', 'snorlax'];
const characters = [
  { name: 'Ash Ketchum', image: '/ash-picture-1.png' },
  { name: 'Misty', image: '/misty.jpg' },
  { name: 'Brock', image: '/brock.jpg' },
  { name: 'Professor Oak', image: '/jessie-team-rocket.jpg' }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current Pokémon index
  const [guess, setGuess] = useState(''); // Store user input
  const [feedback, setFeedback] = useState(''); // Feedback (correct/wrong)
  const [score, setScore] = useState(0); // Track correct guesses
  const [isGameOver, setIsGameOver] = useState(false); // Check if the game is over
  const [pokemonImage, setPokemonImage] = useState(null); // Pokémon sprite
  const [characterImage, setCharacterImage] = useState(null); // Random character image

  // Fetch Pokémon image and select a random character image
  useEffect(() => {
    const fetchPokemonImage = async () => {
      const currentPokemon = easyPokemon[currentIndex];
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        const data = await response.json();
        setPokemonImage(data.sprites.front_default); // Set the Pokémon's front sprite
      } catch (err) {
        setFeedback('Error loading Pokémon image.');
      }

      // Select a random character image for each question
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
      setCharacterImage(randomCharacter.image); // Update character image
    };

    fetchPokemonImage(); // Fetch image when currentIndex changes
  }, [currentIndex]); // Run this effect whenever the currentIndex changes

  // Handle user guess submission
  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const currentPokemon = easyPokemon[currentIndex];
    if (guess.toLowerCase() === currentPokemon) {
      setFeedback('Correct! 🎉');
      setScore((prevScore) => prevScore + 1); // Increment score
    } else {
      setFeedback('Wrong! ❌');
    }

    setGuess(''); // Clear the input

    // Move to the next Pokémon after a short delay
    setTimeout(() => {
      if (currentIndex + 1 < easyPokemon.length) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setFeedback(''); // Clear feedback for the next Pokémon
      } else {
        setIsGameOver(true); // End the game when all Pokémon are guessed
      }
    }, 2000);
  };

  return (
    <div className="App">
              {characterImage && (
          <div className="character-container">
            <img src={characterImage} alt="Random Pokémon Character"  style={{ width: '150px', height: 'auto' }} />
          </div>
        )}

      
      <div className="game-container">
      
        <div className="game-content">
        <h1>Pokémon Quiz Game</h1>
          {isGameOver ? (
            <div>
              <h2>Game Over!</h2>
              <p>You got {score} out of {easyPokemon.length} correct!</p>
            </div>
          ) : (
            <div>
              {pokemonImage && (
                <div>
                  <img src={pokemonImage} alt={`Guess the Pokémon`} />
                  <form onSubmit={handleGuessSubmit}>
                    <input
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="What's this Pokémon?"
                    />
                    <button type="submit">Submit</button>
                  </form>
                  {feedback && <p>{feedback}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
