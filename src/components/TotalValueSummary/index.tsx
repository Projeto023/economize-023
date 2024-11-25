import {
  Box,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface RowData {
  id: number;
  description: string;
  value: number;
  type: string;
  date: Date; // Changed type to Date
  userId: number;
}

const TotalValueSummary = ({ rows }: { rows: RowData[] }) => {
  const [parsedRows, setParsedRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>(parsedRows);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Convert string dates to Date objects if necessary (in case it's fetched as string)
    const parsedRows = rows.map((row) => ({
      ...row,
      date: row.date instanceof Date ? row.date : new Date(row.date),
    }));
    setFilteredRows(parsedRows);
    setParsedRows(parsedRows);
  }, [rows]);

  const filterByDate = (monthsBack: number) => {
    const today = new Date();
    const filtered = parsedRows.filter((row) => {
      const rowDate = row.date; // No need to convert to Date, already handled
      const differenceInMonths =
        (today.getFullYear() - rowDate.getFullYear()) * 12 +
        (today.getMonth() - rowDate.getMonth());
      return differenceInMonths <= monthsBack;
    });
    setFilteredRows(filtered);
  };

  const calculateTotals = (rowsToCalculate: RowData[]) => {
    let totalGastos = 0;
    let totalRenda = 0;

    rowsToCalculate.forEach((row) => {
      const rowValue = Number(row.value);
      if (row.type === "GASTO") {
        totalGastos += rowValue;
      } else {
        totalRenda += rowValue;
      }
    });

    const saldoNumeric = totalRenda - totalGastos;

    return {
      totalGastos: totalGastos
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      totalRenda: totalRenda
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      saldo: saldoNumeric
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."), // Formatted string version
      saldoNumeric, // Numeric version for comparison
    };
  };

  const { totalGastos, totalRenda, saldo, saldoNumeric } =
    calculateTotals(filteredRows);

  function calculateFontSize(value: string) {
    return Math.max(1.5, 3.5 - value.length * 0.2);
  }

  return (
    <Box
      textAlign="center"
      bgcolor="#f0f4f8"
      p={4}
      borderRadius={3}
      boxShadow={3}
      margin={5}
      maxWidth="900px"
      mx="auto"
    >
      {/* Filter Buttons */}

      <Grid
        container
        sx={{
          borderRadius: "20px",
          mb: 3,
          justifyContent: "center",
          "& .MuiButton-root": {
            padding: "10px 20px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#125a9a",
            },
            width: "7em",
          },
        }}
      >
        <Grid item xs={6} sm={6} md={2}>
          <Button variant="contained" onClick={() => filterByDate(1)}>
            1 Mês
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <Button variant="contained" onClick={() => filterByDate(6)}>
            6 Meses
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={2}
          sx={{
            marginTop: {
              sm: "1em",
              xs: "1em",
              md: "0em",
            },
          }}
        >
          <Button variant="contained" onClick={() => filterByDate(12)}>
            1 Ano
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={2}
          sx={{
            marginTop: {
              sm: "1em",
              xs: "1em",
              md: "0em",
            },
          }}
        >
          <Button
            variant="contained"
            onClick={() => setFilteredRows(parsedRows)}
          >
            Total
          </Button>
        </Grid>
      </Grid>

      {/* Total Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Total de Gastos
              </Typography>
              <Typography
                variant="h4"
                color="error"
                fontWeight="bold"
                sx={{
                  fontSize: `${calculateFontSize(totalGastos)}rem`,
                }}
              >
                R$ {totalGastos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Total de Renda
              </Typography>
              <Typography
                variant="h4"
                color="primary"
                fontWeight="bold"
                sx={{
                  fontSize: `${calculateFontSize(totalRenda)}rem`,
                }}
              >
                R$ {totalRenda}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Saldo
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={saldoNumeric >= 0 ? "success.main" : "error.main"}
                sx={{
                  fontSize: `${calculateFontSize(saldo)}rem`,
                }}
              >
                R$ {saldo}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalValueSummary;
