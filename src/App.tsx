import { Transformer } from "konva/lib/shapes/Transformer";
import { useRef, useState } from "react";
import { Calendar } from "./Calendar";

type MonthId =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

export type Months = Record<MonthId, Month>;

export interface Month {
  id: MonthId;
  color: string;
  name: string;
  goal: string;
}

let initialMonths: Months = {
  jan: { id: "jan", color: "#00429d", name: "January", goal: "" },
  feb: { id: "feb", color: "#505ba0", name: "February", goal: "" },
  mar: { id: "mar", color: "#7877a1", name: "March", goal: "" },
  apr: { id: "apr", color: "#9a949e", name: "April", goal: "" },
  may: { id: "may", color: "#b8b396", name: "May", goal: "" },
  jun: { id: "jun", color: "#d1d583", name: "June", goal: "" },
  jul: { id: "jul", color: "#e0d237", name: "July", goal: "" },
  aug: { id: "aug", color: "#e7a547", name: "August", goal: "" },
  sep: { id: "sep", color: "#e3794d", name: "September", goal: "" },
  oct: { id: "oct", color: "#d44d4c", name: "October", goal: "" },
  nov: { id: "nov", color: "#ba2146", name: "November", goal: "" },
  dec: { id: "dec", color: "#93003a", name: "December", goal: "" },
};

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [goal, setGoal] = useState<string>();
  const [months, setMonths] = useState<Months>(initialMonths);

  const addGoal = () => {
    const match = Object.values(months).find(
      (month) => month.goal.length === 0
    );
    if (match) {
      setMonths({
        ...months,
        [match.id]: { ...match, goal },
      });
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  };

  const moveGoal = (sourceId: string, targetId: string) => {
    const source = Object.values(months).find((month) => month.id === sourceId);
    const target = Object.values(months).find((month) => month.id === targetId);
    if (source && target) {
      setMonths({
        ...months,
        [targetId]: { ...target, goal: source.goal },
        [sourceId]: { ...source, goal: target.goal },
      });
    }
  };

  return (
    <>
      <div style={{ width: "400px", margin: "auto" }}>
        <input
          ref={inputRef}
          type="text"
          id="goal"
          name="goal"
          onChange={(e) => setGoal(e.target.value)}
        />
        <button onClick={addGoal}>Add goal</button>
      </div>
      <Calendar months={months} onMoveGoal={moveGoal} />
    </>
  );
};

export default App;
