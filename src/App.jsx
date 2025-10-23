import "./App.css";
import { useState, useEffect } from "react";
import { postNewJoke, getAllJokes } from "./services/jokeService.js";

export const App = () => {
  const [newJoke, setNewJoke] = useState("");
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    getAllJokes().then((jokesArray) => {
      setJokes(jokesArray);
    });
  }, []);

  const handleJokeAdded = (newlyAddedJoke) => {
    // Add the new joke to the existing list
    setJokes((previousJokes) => [...previousJokes, newlyAddedJoke]);
  };

  const handlePostJoke = async (event) => {
    event.preventDefault();
    if (!newJoke.trim()) return; // Prevent empty posts

    // Call the async POST function
    const newlyAddedJoke = await postNewJoke(newJoke.trim());

    if (newlyAddedJoke) {
      setNewJoke(""); // Clear the input field
      //Trigger a function to refresh the joke list in you main component
      // or add the joke to you local state
      handleJokeAdded(newlyAddedJoke);
    }
  };

  return (
    <div className="app-container">
      <div className="app-heading">
        <h1 className="app-heading-text">Chuckle Checklist</h1>
      </div>
      <h2>Add Joke</h2>
        <hr />
      <div className="joke-add-form">
        
        <form onSubmit={handlePostJoke}>
          <input
            className="joke-input"
            type="text"
            placeholder="New One Liner"
            value={newJoke}
            onChange={(event) => setNewJoke(event.target.value)}
          />
          <button type="submit" className="joke-input-submit">Add</button>
        </form>
      </div>

    
      <div className="joke-lists-container"><ul>     
         <h2>Joke List <span className="told-count">({jokes.length})</span></h2>

        {jokes.map((joke) => (
          <li key={joke.id} className="joke-list-item">{joke.text}</li>
        ))}
      </ul></div>

      
    </div>
  );
};
