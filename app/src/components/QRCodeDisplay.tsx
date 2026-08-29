import { useMemo } from 'react';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

// Simple QR-like pattern generator for visual display
// In a real app, use a proper QR library
export function QRCodeDisplay({ data, size = 200 }: QRCodeDisplayProps) {
  const modules = useMemo(() => {
    const gridSize = 25;
    const cells: boolean[][] = [];

    // Seed-based pseudo-random from data string
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed = ((seed << 5) - seed + data.charCodeAt(i)) & 0xffffffff;
    }

    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Initialize
    for (let r = 0; r < gridSize; r++) {
      cells[r] = [];
      for (let c = 0; c < gridSize; c++) {
        cells[r][c] = false;
      }
    }

    // Position detection patterns (corners)
    const drawFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          cells[row + r][col + c] =
            r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      cells[6][i] = i % 2 === 0;
      cells[i][6] = i % 2 === 0;
    }

    // Dark module
    cells[gridSize - 8][8] = true;

    // Fill data modules pseudo-randomly from seed
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!cells[r][c]) {
          cells[r][c] = rand() > 0.5;
        }
      }
    }

    return cells;
  }, [data]);

  const cellSize = Math.floor(size / modules.length);
  const actualSize = cellSize * modules.length;

  return (
    <div
      className="rounded-xl p-3 mx-auto"
      style={{
        background: '#ffffff',
        width: actualSize + 24,
        height: actualSize + 24,
      }}
    >
      <svg width={actualSize} height={actualSize} viewBox={`0 0 ${actualSize} ${actualSize}`}>
        {modules.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#1A1218"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
