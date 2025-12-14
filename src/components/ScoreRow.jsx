import { useMemo } from "react";
import FormModal from "./structure/FormModal";

export default function ScoreRow({
  title,
  detail,
  playerScores,
  numberOfPlayers,
  playerNames,
  children,
  hideSubmit = false,
  updatePlayerScore
}) {
  const playerArr = useMemo(
    () => new Array(numberOfPlayers).fill(null),
    [numberOfPlayers]
  );

  return (
    <tr>
      <th>{title}</th>
      <td>{detail}</td>
      {playerArr.map((_, i) => (
        <td key={i}>
          <FormModal
            label={playerScores[i]?.[title] ?? "---"}
            title={`${title} score for ${playerNames[i] ?? `Player ${i + 1}`}`}
            submit={hideSubmit ? null : undefined}
            onSubmit={(evt) => updatePlayerScore(i, title, evt)}
          >
            {children}
          </FormModal>
        </td>
      ))}
    </tr>
  );
}
