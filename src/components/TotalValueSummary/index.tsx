import { Box, Typography } from "@mui/material";

interface RowData {
  id: number;
  description: string;
  value: number;
  type: string;
  date: Date;
  userId: number;
}

const TotalValueSummary = ({ rows }: { rows: RowData[] }) => {
  const calculateTotalValor = () => {
    let total = 0;
    rows.forEach((row) => {
      const rowValue = Number(row.value);
      const isExpense = row.type == "GASTO";
      if (isExpense) {
        total -= rowValue;
      } else {
        total += rowValue;
      }
    });
    return total.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const totalValor = calculateTotalValor();

  return (
    <Box
      textAlign="center"
      bgcolor="#f4f4f4"
      p={2}
      borderRadius={8}
      border={1}
      borderColor="primary.main"
      margin={5}
    >
      <Typography variant="h5" color="primary">
        Total de gastos:
        <br />
        R$ {totalValor}
      </Typography>
    </Box>
  );
};

export default TotalValueSummary;
