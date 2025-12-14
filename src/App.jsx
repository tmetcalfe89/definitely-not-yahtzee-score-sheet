import { useCallback, useMemo } from "react";
import Page from "./components/structure/Page";
import "./style.scss";
import ScoreRow from "./components/ScoreRow";
import FormModal from "./components/structure/FormModal";
import useLocalStorage from "react-localstorage-hook";

const NUMBERS = ["One", "Two", "Three", "Four", "Five", "Six"];
const SPECIALS = [
  "Three of a Kind",
  "Four of a Kind",
  "Full House",
  "Sm Straight",
  "Lg Straight",
  "Yahtzee",
  "Chance",
  "Bonus Yahtzee",
];

function App() {
  const [numberOfPlayers, setNumberOfPlayers] = useLocalStorage(
    "numberOfPlayers",
    2
  );
  const [playerScores, setPlayerScores] = useLocalStorage("playerScores", []);
  const [playerNames, setPlayerNames] = useLocalStorage("playerNames", []);

  const playerArr = useMemo(
    () => new Array(numberOfPlayers).fill(null),
    [numberOfPlayers]
  );

  const updatePlayerName = useCallback(
    (index, value) => {
      setPlayerNames((p) => {
        const n = [...p];
        n[index] = value;
        return n;
      });
    },
    [setPlayerNames]
  );

  const updatePlayerScore = useCallback(
    (index, key, value) => {
      setPlayerScores((p) => {
        const n = [...p];
        n[index] = n[index] ?? {};
        n[index][key] = value;
        return n;
      });
    },
    [setPlayerScores]
  );

  return (
    <Page name="Yahtzee Score Sheet">
      <table>
        <tr>
          <th>Upper Section</th>
          <th>Score</th>
          {playerArr.map((_, i) => (
            <th key={i}>
              <FormModal
                label={playerNames[i] ?? `Player ${i + 1}`}
                title={`Change Player ${i + 1}'s name`}
              >
                <input
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  value={playerNames[i]}
                  onChange={(evt) => updatePlayerName(i, evt.target.value)}
                />
              </FormModal>
            </th>
          ))}
        </tr>
        {NUMBERS.map((num, i) => (
          <ScoreRow
            key={num}
            title={`${num}s`}
            detail={`Total of ${num}s`}
            playerScores={playerScores}
            numberOfPlayers={numberOfPlayers}
            playerNames={playerNames}
            hideSubmit
            updatePlayerScore={(player, title, evt) => {
              if (evt.nativeEvent.submitter.value === "Clear") {
                updatePlayerScore(player, title, undefined);
                return;
              }
              updatePlayerScore(
                player,
                title,
                +evt.nativeEvent.submitter.value * (i + 1)
              );
            }}
          >
            <fieldset role="group">
              <input type="submit" value="0" />
              <input type="submit" value="1" />
              <input type="submit" value="2" />
              <input type="submit" value="3" />
              <input type="submit" value="4" />
              <input type="submit" value="5" />
            </fieldset>
            <input type="submit" value="Clear" />
          </ScoreRow>
        ))}
        <tr>
          <th>Upper Subtotal</th>
          <td>Add em up</td>
          {playerArr.map((_, i) => {
            return (
              <td key={i}>
                <button disabled>
                  {playerScores[i]
                    ? NUMBERS.reduce((acc, num) => {
                        const score = playerScores[i][`${num}s`];
                        return acc + (typeof score === "number" ? score : 0);
                      }, 0)
                    : 0}
                </button>
              </td>
            );
          })}
        </tr>
        <tr>
          <th>Bonus</th>
          <td>35 if subtotal ≥ 63</td>
          {playerArr.map((_, i) => {
            const subtotal = playerScores[i]
              ? NUMBERS.reduce((acc, num) => {
                  const score = playerScores[i][`${num}s`];
                  return acc + (typeof score === "number" ? score : 0);
                }, 0)
              : 0;
            return (
              <td key={i}>
                <button disabled>{subtotal >= 63 ? 35 : 0}</button>
              </td>
            );
          })}
        </tr>
        <tr>
          <th>Upper Total</th>
          <td>Subtotal + Bonus</td>
          {playerArr.map((_, i) => {
            const subtotal = playerScores[i]
              ? NUMBERS.reduce((acc, num) => {
                  const score = playerScores[i][`${num}s`];
                  return acc + (typeof score === "number" ? score : 0);
                }, 0)
              : 0;
            const bonus = subtotal >= 63 ? 35 : 0;
            return (
              <td key={i}>
                <button disabled>{subtotal + bonus}</button>
              </td>
            );
          })}
        </tr>

        <tr>
          <th>Lower Section</th>
          <th>Score</th>
          {playerArr.map((_, i) => (
            <th key={i}>
              <button disabled>{playerNames[i] ?? `Player ${i + 1}`}</button>
            </th>
          ))}
        </tr>
        <ScoreRow
          title="Three of a Kind"
          detail="Total of all dice"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(player, title, +evt.target["threeofakind"].value);
          }}
        >
          <input name="threeofakind" placeholder="Total of all dice" />
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Four of a Kind"
          detail="Total of all dice"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(player, title, +evt.target["fourofakind"].value);
          }}
        >
          <input name="fourofakind" placeholder="Total of all dice" />
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Full House"
          detail="25 points"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          hideSubmit
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(
              player,
              title,
              evt.nativeEvent.submitter.value === "Yes" ? 25 : 0
            );
          }}
        >
          <fieldset role="group">
            <input type="submit" value="Yes" />
            <input type="submit" value="No" />
          </fieldset>
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Sm Straight"
          detail="30 points"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          hideSubmit
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(
              player,
              title,
              evt.nativeEvent.submitter.value === "Yes" ? 30 : 0
            );
          }}
        >
          <fieldset role="group">
            <input type="submit" value="Yes" />
            <input type="submit" value="No" />
          </fieldset>
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Lg Straight"
          detail="40 points"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          hideSubmit
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(
              player,
              title,
              evt.nativeEvent.submitter.value === "Yes" ? 40 : 0
            );
          }}
        >
          <fieldset role="group">
            <input type="submit" value="Yes" />
            <input type="submit" value="No" />
          </fieldset>
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Yahtzee"
          detail="50 points"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          hideSubmit
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(
              player,
              title,
              evt.nativeEvent.submitter.value === "Yes" ? 50 : 0
            );
          }}
        >
          <fieldset role="group">
            <input type="submit" value="Yes" />
            <input type="submit" value="No" />
          </fieldset>
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Chance"
          detail="Total of all dice"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(player, title, +evt.target["chance"].value);
          }}
        >
          <input name="chance" placeholder="Total of all dice" />
          <input type="submit" value="Clear" />
        </ScoreRow>
        <ScoreRow
          title="Bonus Yahtzee"
          detail="100 points each"
          playerScores={playerScores}
          numberOfPlayers={numberOfPlayers}
          playerNames={playerNames}
          updatePlayerScore={(player, title, evt) => {
            if (evt.nativeEvent.submitter.value === "Clear") {
              updatePlayerScore(player, title, undefined);
              return;
            }
            updatePlayerScore(
              player,
              title,
              +evt.nativeEvent.submitter.value * 100
            );
          }}
          hideSubmit
        >
          <fieldset role="group">
            <input type="submit" value="0" />
            <input type="submit" value="1" />
            <input type="submit" value="2" />
            <input type="submit" value="3" />
            <input type="submit" value="4" />
            <input type="submit" value="5" />
          </fieldset>
          <input type="submit" value="Clear" />
        </ScoreRow>

        <tr>
          <th>Lower Total</th>
          <td>Add em up</td>
          {playerArr.map((_, i) => {
            return (
              <td key={i}>
                <button disabled>
                  {playerScores[i]
                    ? SPECIALS.reduce((acc, key) => {
                        const score = playerScores[i][key];
                        return acc + (typeof score === "number" ? score : 0);
                      }, 0)
                    : 0}
                </button>
              </td>
            );
          })}
        </tr>
        <tr>
          <th>Total Score</th>
          <td>Upper Total + Lower Total</td>
          {playerArr.map((_, i) => {
            const upperSubtotal = playerScores[i]
              ? NUMBERS.reduce((acc, num) => {
                  const score = playerScores[i][`${num}s`];
                  return acc + (typeof score === "number" ? score : 0);
                }, 0)
              : 0;
            const upperBonus = upperSubtotal >= 63 ? 35 : 0;
            const upperTotal = upperSubtotal + upperBonus;
            const lowerTotal = playerScores[i]
              ? SPECIALS.reduce((acc, key) => {
                  const score = playerScores[i][key];
                  return acc + (typeof score === "number" ? score : 0);
                }, 0)
              : 0;
            return (
              <td key={i}>
                <button disabled>{upperTotal + lowerTotal}</button>
              </td>
            );
          })}
        </tr>
      </table>
    </Page>
  );
}

export default App;
