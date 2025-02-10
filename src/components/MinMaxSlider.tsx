import {
  ChangeEvent,
  Dispatch,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import "./MinMaxSlider.css";
import { IDispatchType, IMapFilterAction } from "../App";
import { useAppDispatch } from "../state/hooks";
import {
  setUniversityFilterMax,
  setUniversityFilterMin,
} from "../state/slices/filterSlice";

interface IKnobAttributes {
  position: {
    x: number;
  };
  value: number;
  clicked: boolean;
}

export default function MinMaxSlider({
  minValueLimit,
  maxValueLimit,
  minValue,
  maxValue,
}: {
  minValueLimit: number;
  maxValueLimit: number;
  minValue: number;
  maxValue: number;
}) {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const minKnobRef = useRef<HTMLDivElement>(null);
  const maxKnobRef = useRef<HTMLDivElement>(null);

  const [minKnobAttributes, setMinKnobAttributes] = useState<IKnobAttributes>({
    position: { x: valueToPos(minValue) },
    value: minValue,
    clicked: false,
  });
  const [maxKnobAttributes, setMaxKnobAttributes] = useState<IKnobAttributes>({
    position: { x: valueToPos(maxValue) },
    value: maxValue,
    clicked: false,
  });

  useEffect(() => {
    if (!containerRef.current || !minKnobRef.current || !maxKnobRef.current)
      return;

    setMinKnobAttributes((prev) => {
      return { ...prev, position: { x: valueToPos(minKnobAttributes.value) } };
    });

    setMaxKnobAttributes((prev) => {
      return { ...prev, position: { x: valueToPos(maxKnobAttributes.value) } };
    });

    minKnobRef.current.addEventListener("mousedown", handleMouseDown);
    maxKnobRef.current.addEventListener("mousedown", handleMouseDown);

    return () => {
      minKnobRef.current?.removeEventListener("mousedown", handleMouseDown);
      maxKnobRef.current?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [containerRef.current, minKnobRef.current, maxKnobRef.current]);

  useEffect(() => {
    if (!minKnobAttributes.clicked && !maxKnobAttributes.clicked) return;

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [minKnobAttributes.clicked, maxKnobAttributes.clicked]);

  useEffect(() => {
    dispatch(setUniversityFilterMin(minKnobAttributes.value));
  }, [minKnobAttributes.value]);

  useEffect(() => {
    dispatch(setUniversityFilterMax(maxKnobAttributes.value));
  }, [maxKnobAttributes.value]);

  function handleMouseDown(e: MouseEvent) {
    // @ts-ignore
    const elementId = this.id as string;
    e.preventDefault();

    if (elementId === "min-knob") {
      setMinKnobAttributes((prevState) => {
        return { ...prevState, clicked: true };
      });
    } else if (elementId === "max-knob") {
      setMaxKnobAttributes((prevState) => {
        return { ...prevState, clicked: true };
      });
    }
  }

  function handleMouseUp(e: MouseEvent) {
    if (minKnobAttributes.clicked) {
      setMinKnobAttributes((prevState) => {
        return { ...prevState, clicked: false };
      });
    } else if (maxKnobAttributes.clicked) {
      setMaxKnobAttributes((prevState) => {
        return { ...prevState, clicked: false };
      });
    }
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();

    if (!minKnobRef.current || !maxKnobRef.current) return;

    const containerBounds = containerRef.current!.getBoundingClientRect();

    const boundedMousePos =
      e.clientX - containerBounds.left - minKnobRef.current.clientWidth / 2;

    if (minKnobAttributes.clicked) {
      const minOffset = Math.min(
        Math.max(boundedMousePos, -minKnobRef.current.clientWidth / 2),
        maxKnobAttributes.position.x - minKnobRef.current.clientWidth / 2
      );

      setMinKnobAttributes((prev) => {
        return {
          ...prev,
          position: { x: minOffset },
          value: posToValue(minOffset),
        };
      });
    } else if (maxKnobAttributes.clicked) {
      const maxOffset = Math.min(
        Math.max(
          boundedMousePos,
          minKnobAttributes.position.x + minKnobRef.current.clientWidth / 2
        ),
        containerBounds.width - minKnobRef.current.clientWidth / 2
      );
      setMaxKnobAttributes((prev) => {
        return {
          ...prev,
          position: { x: maxOffset },
          value: posToValue(maxOffset),
        };
      });
    }
  }

  function posToValue(pos: number) {
    if (!containerRef.current || !minKnobRef.current) return 0;

    return Math.round(
      ((pos + minKnobRef.current.clientWidth / 2) * maxValueLimit) /
        containerRef.current.getBoundingClientRect().width
    );
  }

  function valueToPos(value: number) {
    if (!containerRef.current || !minKnobRef.current) return 0;

    return (
      Math.round(
        (value * containerRef.current.getBoundingClientRect().width) /
          maxValueLimit
      ) -
      minKnobRef.current.clientWidth / 2
    );
  }

  function minMaxInputHandler(e: ChangeEvent<HTMLInputElement>) {
    const elementId = e.target.id;
    var value = parseInt(e.target.value);

    if (elementId === "min-input") {
      if (isNaN(value)) {
        setMinKnobAttributes((prev) => {
          return {
            ...prev,
            value: minValueLimit,
            position: { x: valueToPos(minValueLimit) },
          };
        });
        return;
      }
      // clamp value
      value = Math.min(Math.max(value, minValueLimit), maxKnobAttributes.value);
      setMinKnobAttributes((prev) => {
        return { ...prev, value: value, position: { x: valueToPos(value) } };
      });
    } else if (elementId === "max-input") {
      if (isNaN(value)) {
        setMaxKnobAttributes((prev) => {
          return {
            ...prev,
            value: prev.value,
            position: { x: valueToPos(prev.value) },
          };
        });
        return;
      }
      // clamp value
      value = Math.min(Math.max(value, minKnobAttributes.value), maxValueLimit);
      setMaxKnobAttributes((prev) => {
        return { ...prev, value: value, position: { x: valueToPos(value) } };
      });
    }
  }

  return (
    <div className="min-max-container">
      <div ref={containerRef} className="min-max-slider-container">
        <div
          className="min-max-slider-fill"
          style={{
            width: maxKnobAttributes.position.x - minKnobAttributes.position.x,
            left: minKnobAttributes.position.x + 5,
          }}
        />
        <div
          ref={minKnobRef}
          className="min-max-knob"
          id="min-knob"
          style={{
            transform: `translate(${minKnobAttributes.position.x}px, 0px)`,
          }}
        />
        <div
          ref={maxKnobRef}
          className="min-max-knob"
          id="max-knob"
          style={{
            transform: `translate(${maxKnobAttributes.position.x}px, 0px)`,
          }}
        />
      </div>
      <div className="min-max-input-container">
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <input
            id="min-input"
            className="slider-input"
            value={minKnobAttributes.value}
            onChange={minMaxInputHandler}
          />
          <label
            htmlFor="min-input"
            className="slider-label"
            style={{ textAlign: "left" }}
          >
            Min
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <input
            id="max-input"
            className="slider-input"
            value={maxKnobAttributes.value}
            onChange={minMaxInputHandler}
          />
          <label
            htmlFor="max-input"
            className="slider-label"
            style={{ textAlign: "right" }}
          >
            Max
          </label>
        </div>
      </div>
    </div>
  );
}
