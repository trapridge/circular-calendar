import { useRef, useState } from "react";
import { Calendar } from "./Calendar";
import styled from "styled-components";

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

const Container = styled.section`
  width: 600px;
  background-color: palegoldenrod;
`;

const Form = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 40px 0 40px;

  input {
    width: 75%;
  }

  button {
    margin-left: 10px;
    width: 25%;
  }
`;

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
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
        inputRef.current.value = "";
        inputRef.current.focus();
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

  const removeGoal = (id: string) => {
    const month = Object.values(months).find((month) => month.id === id);

    if (month) {
      setMonths({
        ...months,
        [id]: { ...month, goal: "" },
      });
    }
  };

  const isFull = () =>
    Object.values(months).every((month) => month.goal.length > 0);

  return (
    <Container>
      <Form>
        <input
          ref={inputRef}
          type="text"
          id="goal"
          name="goal"
          onChange={(e) => setGoal(e.target.value)}
          onKeyUp={(e) => e.code === "Enter" && addGoal()}
        />
        <button disabled={isFull()} onClick={addGoal}>
          Add
        </button>
      </Form>
      <Calendar
        months={Object.values(months)}
        onMoveGoal={moveGoal}
        onRemoveGoal={removeGoal}
      />
    </Container>
  );
};

export default App;
