import { motion } from "framer-motion";

const tileDimensions = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
};

const tileWidths = {
  sm: "w-8",
  md: "w-9 md:w-12",
  lg: "w-12 md:w-16",
};

export function Tiles({
  className = "",
  rows = 100,
  cols = 10,
  tileClassName = "",
  tileSize = "md",
}) {
  const rowsArray = new Array(rows).fill(1);
  const colsArray = new Array(cols).fill(1);

  return (
    <div 
      className={`absolute inset-0 flex justify-center items-start ${className}`}
      style={{ 
        "--tile": "rgba(227, 208, 254, 0.15)",
      }}
    >
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={`${tileWidths[tileSize]} border-l border-gray-200 relative ${tileClassName}`}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(--tile)`,
                transition: { duration: 0 }
              }}
              animate={{
                transition: { duration: 2 }
              }}
              key={`col-${j}`}
              className={`${tileDimensions[tileSize]} border-r border-t border-gray-200 relative ${tileClassName}`}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
