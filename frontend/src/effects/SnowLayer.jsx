import Snowfall from "react-snowfall";
import { useSnow } from "../context/SnowContext";

const SnowLayer = () => {
  const { isSnowOn } = useSnow();

  if (!isSnowOn) return null;

  return (
    <Snowfall
      snowflakeCount={300}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default SnowLayer;
