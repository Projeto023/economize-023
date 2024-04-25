import {
  Typography,
  Avatar,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import Container from "@mui/material/Container";
import { ChangeEvent, useState } from "react";

const rowDefinition = [
  {
    formattedName: "Descrição",
    rowname: "description",
    dataFormat: "text",
    isSelect: false,
  },
  {
    formattedName: "Valor",
    rowname: "value",
    dataFormat: "number",
    isSelect: false,
  },
  {
    formattedName: "Tipo",
    rowname: "type",
    dataFormat: "number",
    isSelect: true,
    selectValues: ["Gasto", "Renda"],
  },
];

const Home = () => {
  return (
    <Container component="main" maxWidth="xs">
      <UserAvatar />
      <DynamicTable />
    </Container>
  );
};

const UserAvatar = () => {
  return (
    <Paper
      elevation={3}
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        padding: "10px",
        margin: "10px",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar
        src="/avatar/image.png"
        alt="User Avatar"
        sx={{ width: 50, height: 50, margin: "auto" }}
      />
      <Typography variant="h6" gutterBottom>
        Vinicius de Jesus
      </Typography>
    </Paper>
  );
};

interface RowData {
  [key: string]: {
    [key: string]: string;
  };
}

const DynamicTable = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData>({});
  const [rowCount, setRowCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: string,
    columnName: string
  ) => {
    const { value } = e.target;
    setRowData((prevData) => {
      if (!prevData) {
        prevData = {};
      }
      return {
        ...prevData,
        [rowIndex]: {
          ...prevData[rowIndex],
          [columnName]: value,
        },
      };
    });
  };

  const handleSubmit = () => {
    setRows((prevRows) => [...prevRows, rowData]);
    setRowData({});
    setRowCount((currrentCount) => (currrentCount += 1));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <TotalValueSummary rows={rows} />
        <Table>
          <TableHead>
            <TableRow>
              {rowDefinition.map((definition) => (
                <TableCell>{definition.formattedName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const backgroundColor =
                row[index]["type"] === "Gasto" ? "#FFCCCB" : "lightgreen";

              return (
                <TableRow
                  key={index}
                  style={{ backgroundColor: backgroundColor }}
                >
                  {rowDefinition.map((definition) => (
                    <TableCell>{row[index][definition.rowname]}</TableCell>
                  ))}
                </TableRow>
              );
            })}
            <TableRow>
              {rowDefinition.map((definition) => (
                <TableCell>
                  <TextField
                    select={definition.isSelect}
                    type={definition.dataFormat}
                    variant="outlined"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, rowCount.toString(), definition.rowname)
                    }
                    value={
                      rowData[rowCount]
                        ? rowData[rowCount][definition.rowname] || ""
                        : ""
                    }
                  >
                    {definition.selectValues?.map((val) => (
                      <MenuItem value={val}>{val}</MenuItem>
                    ))}
                  </TextField>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Add Row
      </Button>
    </div>
  );
};

const TotalValueSummary = ({ rows }: { rows: RowData[] }) => {
  // Calculate the total valor
  const calculateTotalValor = () => {
    let total = 0;
    rows.forEach((row, index) => {
      const rowValue = Number(row[index]["value"]);
      const isExpense = row[index]["type"] === "Gasto";
      if (isExpense) {
        total -= rowValue;
      } else {
        total += rowValue;
      }
    });
    return total;
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

export default Home;
