import "./App.css";
import { useState, useEffect } from "react";
import {
  postNewJoke,
  getAllJokes,
  updateToldStatus,
  deleteJoke,
  postDeletedJoke,
} from "./services/jokeService.js";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons'

export const App = () => {
  const [newJoke, setNewJoke] = useState("");
  const [jokes, setJokes] = useState([]);
  const [toldJokes, setToldJokes] = useState([]);
  const [untoldJokes, setUntoldJokes] = useState([]);
  const [deleteJokes, setDeletedJokes] = useState([]);

  useEffect(() => {
    getAllJokes().then((jokesArray) => {
      setJokes(jokesArray);
    });
  }, []);

  useEffect(() => {
    const told = jokes.filter((joke) => joke.told);
    const untold = jokes.filter((joke) => !joke.told);

    setToldJokes(told);
    setUntoldJokes(untold);
  }, [jokes]);

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

  const toggleJokeTold = async (jokeId) => {
    // 1. Find the full joke object from state
    const jokeToToggle = jokes.find((joke) => joke.id === parseInt(jokeId));

    if (!jokeToToggle) return;

    const updatedJoke = {
      ...jokeToToggle,
      told: !jokeToToggle.told, // Toggle the told status
    };

    // 3. API CALL: Pass the complete object to the service
    const successfullyUpdatedJoke = await updateToldStatus(updatedJoke);

    if (successfullyUpdatedJoke) {
      setJokes((currentJokes) => {
        return currentJokes.map((joke) => {
          // If the ID matches, use the new, updated object
          if (joke.id === jokeId) {
            return successfullyUpdatedJoke; // Use the object returned from the API
          }
          return joke;
        });
      });
    }
  };

  const jokeToDelete = async (jokeId) => {
    //Find the joke to move to the deleted array
    const jokeFound = jokes.find((joke) => joke.id === jokeId);
    if (jokeFound) {
      const deleteSuccess = await deleteJoke(jokeId);

      if (deleteSuccess) {
        const moveDeletedJoke = await postDeletedJoke(jokeFound);

        if (moveDeletedJoke) {
          setJokes((currentJokes) =>
            currentJokes.filter((joke) => joke.id !== parseInt(jokeId))
          );

          setDeletedJokes((currentDeletedJokes) => [
            ...currentDeletedJokes,
            jokeFound,
          ]);
        }
      } else {
        console.log("Failed to delete joke from API");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="app-heading">
        <h1 className="app-heading-text">Chuckle Checklist</h1>
      </div>
      <h2>Add Your Own Joke</h2>
      <hr />
      <div>
        <form className="joke-add-form" onSubmit={handlePostJoke}>
          <input
            className="joke-input"
            type="text"
            placeholder="New One Liner"
            value={newJoke}
            onChange={(event) => setNewJoke(event.target.value)}
          />
          <button type="joke-input-submit" className="joke-input-submit">
            Add
          </button>
        </form>
      </div>

      <div className="joke-lists-container">
        <ul className="joke-list-container">
          <h2>
            <i className="fa-regular fa-face-meh"></i>
            <span className="list-title">Untold</span>{" "}
            <span className="untold-count">{untoldJokes.length}</span>
            <hr />
          </h2>
          <div className="untoldJoke">
            {untoldJokes.map((untoldJoke) => (
              <li key={untoldJoke.id} className="joke-list-item">
                <p className="joke-list-item-text">{untoldJoke.text}</p>
                <button
                  className="button-icon"
                  aria-label="Delete Joke"
                  onClick={() => jokeToDelete(untoldJoke.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
                <button
                  className="button-icon"
                  aria-label="Mark joke as told"
                  onClick={() => toggleJokeTold(untoldJoke.id)}
                >
                  <i
                    className="fa-regular fa-face-laugh-squint"
                    aria-hidden="true"
                  ></i>
                </button>
              </li>
            ))}
          </div>
        </ul>
        <ul className="joke-list-container">
          <h2>
            <i className="fa-regular fa-face-laugh-squint"></i>
            <span className="list-title">Told</span>
            <span className="told-count">{toldJokes.length}</span>
            <hr />
          </h2>
          <div className="toldJoke">
            {toldJokes.map((toldJoke) => (
              <li key={toldJoke.id} className="joke-list-item">
                <p className="joke-list-item-text">{toldJoke.text}</p>
                <button
                  className="button-icon"
                  aria-label="Delete Joke"
                  onClick={() => jokeToDelete(toldJoke.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>

                <button
                  className="button-icon"
                  aria-label="Mark joke as untold"
                  onClick={() => toggleJokeTold(toldJoke.id)}
                >
                  <i className="fa-regular fa-face-meh" aria-hidden="true"></i>
                </button>
              </li>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};
