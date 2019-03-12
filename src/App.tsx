// SINGLE FILE
import React, { Component, useState, useEffect } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {RNG, randomString} from './util/rng';
import { genHash } from './util/hash';

const centerAlign = css`
  text-align: center;
`;

interface Round {
  hash: string;
  clientSeed?: number;
  serverSeed: number;
  salt: string;
  result?: number;
}

/**
 * hash formula
 * hash = serverSeed + '_' + salt
 */
const initialRound = async (): Promise<Round> => {
  const serverSeed = RNG();
  const salt = randomString();
  const hash = await genHash(`${serverSeed}_${salt}`);
  return {serverSeed, salt, hash};
}

// game view
const Rounds: React.FC<{}> = () => {
  const [rounds, setRounds] = useState([] as Array<Round>);
  const [current, setCurrent] = useState({} as Round);
  const [input, setInput] = useState(0);

  useEffect(() => {
    initialRound().then(r=> {
        setCurrent(r);
    });
  }, []);

  const play = (): any => {
    const result = (input + current.serverSeed) % 100;
    const backround = {...current, result, clientSeed: input};
    const history = [backround, ...rounds];
    setRounds(history);
    setInput(0);
    initialRound().then(r=> {
      setCurrent(r);
    });
  }

  const handleInput = (e: {target: HTMLInputElement}) => {
    const v = parseInt(e.target.value);
    setInput(v);
  }

  return (
    <div>
      <p>Round Hash: {current.hash}</p>
      <p>
        Client Seed
        <input onChange={(e) => handleInput(e)} type='number' value={input} />
        <button onClick={() => play()} type='submit'>Play</button>
      </p>
      <h2 css={centerAlign}>history</h2>
      <RoundHistory history={rounds} />
    </div>
  )
}

interface RDProp {
  history: Round[];
}

// typical table
const RoundHistory: React.FC<RDProp> = (prop) => {
  return (
    <table css={centerAlign}>
      <tr>
        <th>Round Hash</th>
        <th>Client Random (Seed)</th>
        <th>Server Random (Seed)</th>
        <th>Salt</th>
        <th>Result</th>
      </tr>
      {prop.history.map(r => {
        return (
          <tr key={r.hash}>
            <td>{r.hash}</td>
            <td>{r.clientSeed}</td>
            <td>{r.serverSeed}</td>
            <td>{r.salt}</td>
            <td>{r.result} of 0-99</td>
          </tr>
        )
      })}
    </table>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 css={centerAlign}>Provably Fair demo</h1>
        <Rounds/>
      </div>
    );
  }
}

export default App;

