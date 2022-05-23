import { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Arc, Text, Group } from "react-konva";
import { Months } from "./App";

const degToRad = (deg: number): number => deg * (Math.PI / 180.0);
const isH2Month = (index: number) => index > 5;

interface CalendarProps {
  months: Months;
  onMoveGoal: (source: string, target: string) => void;
}

const INITIAL_ROTATION = -90;
const BASE_X = window.innerWidth / 2;
const BASE_Y = 300;
const SLICE_ANGLE = 360 / 12;
const SLICE_OUTER_RADIUS = 200;

interface Dragging {
  id: string;
  startX: number;
  startY: number;
}

export const Calendar = (
  ({ months, onMoveGoal }: CalendarProps) => {
    const mainLayerRef = useRef<Konva.Layer>(null);
    const helperLayerRef = useRef<Konva.Layer>(null);
    const [draggingGoal, setDraggingGoal] = useState<Dragging | undefined>();

    const startDrag = (e: KonvaEventObject<DragEvent>, id: string) => {
      if (helperLayerRef) {
        e.target.moveTo(helperLayerRef.current);
      }
      const { x: startX, y: startY } = e.currentTarget.getPosition();
      setDraggingGoal({ id, startX, startY });
    };

    const endDrag = (e: KonvaEventObject<DragEvent>) => {
      const position = e.currentTarget.absolutePosition();
      if (mainLayerRef.current) {
        e.currentTarget.moveTo(mainLayerRef.current);
        const intersection = mainLayerRef.current.getIntersection(position);
        if (draggingGoal) {
          if (intersection) {
            onMoveGoal(draggingGoal.id, intersection.attrs.id);
          } else {
            e.currentTarget.setPosition({
              x: draggingGoal?.startX,
              y: draggingGoal?.startY,
            });
          }
        }
      }
      setDraggingGoal(undefined);
    };

    const arcs = Object.values(months).map((month, index) => {
      const TEXT_WIDTH = 100;
      const TEXT_PADDING = 10;
      const rotationDeg = INITIAL_ROTATION + index * SLICE_ANGLE;

      return (
        <Group key={index} x={BASE_X} y={BASE_Y}>
          <Arc
            id={month.id}
            fill={month.color}
            rotation={rotationDeg}
            innerRadius={0}
            outerRadius={SLICE_OUTER_RADIUS}
            strokeWidth={2}
            angle={SLICE_ANGLE}
            stroke="lightgray"
          />
          <Text
            x={
              Math.cos(degToRad(rotationDeg + SLICE_ANGLE / 2)) *
              (SLICE_OUTER_RADIUS +
                TEXT_PADDING -
                (isH2Month(index) ? -TEXT_WIDTH : 0))
            }
            y={
              Math.sin(degToRad(rotationDeg + SLICE_ANGLE / 2)) *
              (SLICE_OUTER_RADIUS +
                TEXT_PADDING -
                (isH2Month(index) ? -TEXT_WIDTH : 0))
            }
            text={month.name}
            rotation={
              rotationDeg + SLICE_ANGLE / 2 + (isH2Month(index) ? 180 : 0)
            }
            width={TEXT_WIDTH}
            align={isH2Month(index) ? "right" : "left"}
          />
        </Group>
      );
    });

    const goals = Object.values(months).map((month, index) => {
      const PADDING = 120;
      const rotationDeg =
        INITIAL_ROTATION + index * SLICE_ANGLE + SLICE_ANGLE / 2;
      return (
        month.goal && (
          <Text
            id={month.id}
            name={month.name}
            ref={(el) => {
              if (el) {
                el.offsetX(el.getTextWidth() / 2);
                el.offsetY(el.getTextHeight() / 2);
              }
            }}
            x={BASE_X + Math.cos(degToRad(rotationDeg)) * PADDING}
            y={BASE_Y + Math.sin(degToRad(rotationDeg)) * PADDING}
            text={month.goal}
            rotation={rotationDeg + (isH2Month(index) ? 180 : 0)}
            fill="white"
            draggable={true}
            key={`${month.id}-${month.goal}`}
            listening={true}
            onDragStart={(e) => startDrag(e, month.id)}
            onDragEnd={endDrag}
            align="center"
          />
        )
      );
    });

    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={mainLayerRef}>
          {arcs}
          {goals}
        </Layer>
        <Layer ref={helperLayerRef} />
      </Stage>
    );
  }
);
