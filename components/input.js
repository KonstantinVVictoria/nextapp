import styles from "./Components.module.scss";

export default function input(props) {
  return (
    <div
      style={{
        position: "relative",
        height: props.height,
        width: props.width,
        display: "flex",
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          boxSizing: "border-box",
          position: "absolute",
          height: "120%",
          width: "101.25%",
          transform: "translate(-0.625%, -8%)",
          borderRadius: "50px",
          border: "solid white 2px",
        }}
      />
      <input className={styles.input} />
      <button
        onMouseDown={(e) => props.mouseDownEvent(e)}
        className={styles["input-button"]}
      />
    </div>
  );
}
