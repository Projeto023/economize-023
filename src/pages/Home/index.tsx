import {
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const columnDefinition = [
  {
    id: 1,
    formattedName: "Descrição",
    rowname: "description",
    dataFormat: "text",
    isSelect: false,
  },
  {
    id: 2,
    formattedName: "Valor",
    rowname: "value",
    dataFormat: "number",
    isSelect: false,
  },
  {
    id: 3,
    formattedName: "Tipo",
    rowname: "type",
    dataFormat: "number",
    isSelect: true,
    selectValues: ["Gasto", "Renda"],
  },
  {
    id: 3,
    formattedName: "Data",
    rowname: "date",
    dataFormat: "date",
    isSelect: false,
  },
  {
    id: 4,
    formattedName: "Opções",
    rowname: "options",
    dataFormat: "option",
    isSelect: false,
  },
];

const Home = () => {
  return (
    <Container component="main" maxWidth="md" style={{ height: "100vh" }}>
      <div style={{ minHeight: "100%" }}>
        <UserAvatar />
        <DynamicTable />
      </div>
    </Container>
  );
};

const UserAvatar = () => {
  const [user, setUser] = useState({} as any);

  useEffect(() => {
    fetch(
      "https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/user/?user.id=1"
    ).then((data) => {
      data.json().then((dataJson) => {
        setUser(dataJson);
      });
    });
  }, []);

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
        {user.name}
      </Typography>
    </Paper>
  );
};

interface RowData {
  description: string;
  value: string;
  type: string;
  date: Date;
}

const DynamicTable = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const { handleSubmit, control } = useForm();

  const handleFormSubmit = (data: any) => {
    console.log(data);
    setRows((curRows) => [...curRows, data]);
  };

  useEffect(() => {
    axios
      .get(
        "https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/user/records",
        { params: { "user.id": 2 } }
      )
      .then((response) => {
        const recordData = response.data.map(
          (record: { value: any; recordDate: any; type: any }) => {
            return {
              value: JSON.stringify(record.value),
              date: record.recordDate,
              description: JSON.stringify(record.type),
              type: JSON.stringify(record.type),
            } as RowData;
          }
        );

        setRows((curRows) => [...curRows, ...recordData]);
      });
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <TotalValueSummary rows={rows} />
      <DataGrid
        rows={rows as any[]}
        getRowId={(row) =>
          row.description + row.value + row.type + Math.random()
        }
        style={{ background: "white", minHeight: "50vh" }}
        columns={columnDefinition.map((definition, index) => {
          if (definition.dataFormat === "option") {
            return {
              field: definition.rowname,
              headerName: definition.formattedName,
              width: 150,
              key: index,
              renderCell: () => {
                return <Button onClick={() => alert("teste")}>Click</Button>;
              },
            };
          }
          return {
            field: definition.rowname,
            headerName: definition.formattedName,
            width: 150,
            key: index,
          };
        })}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "1%",
          justifyContent: "space-between",
          padding: "1em",
        }}
      >
        <Controller
          name={`description`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              placeholder="Descrição"
              onChange={(e) => field.onChange(e.target.value)}
              style={{ backgroundColor: "white" }}
            />
          )}
        />

        <Controller
          name={`value`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              variant="outlined"
              placeholder="Valor"
              onChange={(e) => field.onChange(e.target.value)}
              style={{ backgroundColor: "white" }}
            />
          )}
        />

        <Controller
          name={`type`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value || "Gasto"}
              style={{ backgroundColor: "white" }}
            >
              <MenuItem key={"gasto"} value={"Gasto"}>
                Gasto
              </MenuItem>
              <MenuItem key={"renda"} value={"Renda"}>
                Renda
              </MenuItem>
            </Select>
          )}
        />
      </div>
      <Button
        onClick={handleSubmit(handleFormSubmit)}
        variant="contained"
        color="primary"
      >
        Adicionar
      </Button>
    </div>
  );
};

const TotalValueSummary = ({ rows }: { rows: RowData[] }) => {
  const calculateTotalValor = () => {
    let total = 0;
    rows.forEach((row, index) => {
      const rowValue = Number(row.value);
      const isExpense = row.type === "Gasto";
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
