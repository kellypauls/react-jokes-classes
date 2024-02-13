import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numOfJokes = 5 }){
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    async function getJokes() {
      let j = [...jokes]
      let seenJokes = new Set();
      try {
        while (j.length < numOfJokes) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...jokeObject } = res.data;

          if(!seenJokes.has(jokeObject.id)) {
            seenJokes.add(jokeObject.id);
            j.push({ ...jokeObject, votes: 0 });
          }
        }
        setJokes(j);
        setIsLoading(false)
      } catch (err) {
        console.error(err);
      }
    }
    if (jokes.length === 0) getJokes();
  }, [jokes, numOfJokes]);

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }

  function vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.add === id ? { ...j, votes: j.votes + delta } : j)));
  }

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get more jokes
      </button>
      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} votes={votes} vote={vote} />
      ))}
    </div>
  )
}

export default JokeList;