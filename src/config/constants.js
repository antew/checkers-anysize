export const Defaults = {
  boardSize: 8
};

export const ItemTypes = {
  CHECKER: "checker"
};

export const CheckersConstants = {
  EMPTY_SQUARE: 0,
  WHITE: { key: 1, name: "White", symbol: "⛀", kingSymbol: "⛁", color: "#eee", isKing: false, direction: 1 },
  BLACK: { key: 2, name: "Black", symbol: "⛂", kingSymbol: "⛃", color: "#000", isKing: false, direction: -1 }
};
