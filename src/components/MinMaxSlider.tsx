import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "./MinMaxSlider.css";
import { useAppDispatch } from "../state/hooks";
import {
  setUniversityFilterMax,
  setUniversityFilterMin,
} from "../state/slices/filterSlice";

function lerp(
  x1: { pos: number; weight: number },
  x2: { pos: number; weight: number },
  x: number
) {
  return (
    ((x2.pos - x) / (x2.pos - x1.pos)) * x1.weight +
    ((x - x1.pos) / (x2.pos - x1.pos)) * x2.weight
  );
}

interface IKnobAttributes {
  position: {
    x: number;
  };
  value: number;
  clicked: boolean;
}

export default function MinMaxSlider({
  title,
  id,
  resetButton,
  minValueLimit,
  maxValueLimit,
  minValue,
  maxValue,
}: {
  title: string;
  id: string;
  resetButton?: boolean;
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
    position: { x: 0 },
    value: minValue,
    clicked: false,
  });
  const [maxKnobAttributes, setMaxKnobAttributes] = useState<IKnobAttributes>({
    position: { x: 0 },
    value: maxValue,
    clicked: false,
  });

  useEffect(() => {
    if (!containerRef.current || !minKnobRef.current || !maxKnobRef.current)
      return;

    setMinKnobAttributes((prev) => {
      return {
        ...prev,
        position: { x: 0 - minKnobRef.current!.clientWidth / 2 },
      };
    });

    setMaxKnobAttributes((prev) => {
      return {
        ...prev,
        position: {
          x:
            containerRef.current!.getBoundingClientRect().width -
            minKnobRef.current!.clientWidth / 2,
        },
      };
    });

    // containerRef.current.addEventListener("click", handleContainerClick);

    minKnobRef.current.addEventListener("mousedown", handleMouseDown);
    maxKnobRef.current.addEventListener("mousedown", handleMouseDown);

    return () => {
      // containerRef.current?.removeEventListener("click", handleContainerClick);
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

  useEffect(() => {
    if (!containerRef.current) return;
    setMaxKnobAttributes((prev) => {
      return { ...prev, position: { x: valueToPos(prev.value) } };
    });
  }, [containerRef.current?.clientWidth]);

  const handleContainerClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current || !minKnobRef.current || !maxKnobRef.current)
      return;

    const boundedMousePos = Math.min(
      Math.max(e.screenX - containerRef.current!.offsetLeft, 0),
      containerRef.current.clientWidth - minKnobRef.current.clientWidth / 2
    );

    const minOffset = Math.abs(boundedMousePos - minKnobAttributes.position.x);
    const maxOffset = Math.abs(boundedMousePos - maxKnobAttributes.position.x);

    if (minOffset < maxOffset) {
      setMinKnobAttributes((prev) => {
        return {
          ...prev,
          position: {
            x: boundedMousePos - minKnobRef.current!.clientWidth / 2,
          },
          value: posToValue(
            boundedMousePos - minKnobRef.current!.clientWidth / 2
          ),
        };
      });
    } else {
      setMaxKnobAttributes((prev) => {
        return {
          ...prev,
          position: {
            x: boundedMousePos - minKnobRef.current!.clientWidth / 2,
          },
          value: posToValue(
            boundedMousePos - minKnobRef.current!.clientWidth / 2
          ),
        };
      });
    }
  };

  function handleMouseDown(e: MouseEvent) {
    // @ts-ignore
    const elementId = this.id.split("-")[0] as string;
    e.preventDefault();

    if (elementId === "min") {
      setMinKnobAttributes((prevState) => {
        return { ...prevState, clicked: true };
      });
    } else if (elementId === "max") {
      setMaxKnobAttributes((prevState) => {
        return { ...prevState, clicked: true };
      });
    }
  }

  function handleMouseUp(e: MouseEvent) {
    e.stopPropagation();
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

    if (!minKnobRef.current || !maxKnobRef.current || !containerRef.current)
      return;

    const containerBounds = containerRef.current.getBoundingClientRect();

    let boundedMousePos =
      e.clientX - containerBounds.left - minKnobRef.current.clientWidth / 2;

    boundedMousePos = Math.max(
      -minKnobRef.current.clientWidth / 2,
      boundedMousePos
    );
    boundedMousePos = Math.min(
      containerBounds.width - minKnobRef.current.clientWidth / 2,
      boundedMousePos
    );

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
    if (!containerRef.current || !minKnobRef.current) return minValueLimit;

    return lerp(
      { pos: 0 - minKnobRef.current.clientWidth / 2, weight: minValueLimit },
      {
        pos:
          containerRef.current.clientWidth - minKnobRef.current.clientWidth / 2,
        weight: maxValueLimit,
      },
      pos
    );
  }

  function valueToPos(value: number) {
    if (!containerRef.current || !minKnobRef.current) return minValueLimit;

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

  const handleReset = () => {
    setMinKnobAttributes((prev) => {
      return {
        ...prev,
        value: minValueLimit,
        position: { x: 0 - minKnobRef.current!.clientWidth / 2 },
      };
    });

    setMaxKnobAttributes((prev) => {
      return {
        ...prev,
        value: maxValueLimit,
        position: {
          x:
            containerRef.current!.getBoundingClientRect().width -
            minKnobRef.current!.clientWidth / 2,
        },
      };
    });
  };

  return (
    <div className="min-max-container" id={id}>
      <div className="min-max-header">
        <label className="slider-label">{title}</label>
        {resetButton &&
          (minKnobAttributes.value !== minValue ||
            maxKnobAttributes.value !== maxValue) && (
            <button onClick={handleReset}>Reset</button>
          )}
      </div>
      <div
        ref={containerRef}
        className="min-max-slider-container"
        onClick={handleContainerClick}
      >
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
          id={"min-knob-" + id}
          style={{
            transform: `translate(${minKnobAttributes.position.x}px, 0px)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <div
          ref={maxKnobRef}
          className="min-max-knob"
          id={"max-knob-" + id}
          style={{
            transform: `translate(${maxKnobAttributes.position.x}px, 0px)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
      <div className="min-max-input-container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <input
            id={"min-input-" + id}
            className="slider-input"
            value={minKnobAttributes.value}
            onChange={minMaxInputHandler}
          />
          <label
            htmlFor={"min-input-" + id}
            className="slider-label"
            style={{ textAlign: "left", color: "#1a1a1a" }}
          >
            Min
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <label
            htmlFor={"max-input-" + id}
            className="slider-label"
            style={{ textAlign: "right", color: "#1a1a1a" }}
          >
            Max
          </label>
          <input
            id={"max-input-" + id}
            className="slider-input"
            value={maxKnobAttributes.value}
            onChange={minMaxInputHandler}
          />
        </div>
      </div>
    </div>
  );
}
