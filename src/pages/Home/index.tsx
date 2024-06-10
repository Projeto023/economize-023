import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  id: number;
  description: string;
  value: string;
  type: string;
  date: Date;
  userId: number;
}

const DynamicTable = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const { handleSubmit, control, setValue } = useForm();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<RowData | null>(null);

  const handleFormSubmit = (data: any) => {
    createRecord(data);
  };

  const handleEditFormSubmit = (data: any) => {
    if (editData) {
      editRecord(editData.id, data);
    }
  };

  const handleOpen = (row: RowData) => {
    setEditData(row);
    setValue("description", row.description);
    setValue("value", row.value);
    setValue("type", row.type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  useEffect(() => {
    updateRows();
  }, []);

  function updateRows() {
    axios
      .get(
        "https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/user/records",
        { params: { "user.id": 2 } }
      )
      .then((response) => {
        const recordData = response.data.map(
          (record: {
            id: number;
            value: any;
            recordDate: any;
            type: any;
            description: string;
            userId: number;
          }) => {
            return {
              id: record.id,
              value: JSON.stringify(record.value),
              date: record.recordDate,
              description: JSON.stringify(record.description),
              type: JSON.stringify(record.type),
              userId: record.userId,
            } as RowData;
          }
        );

        setRows(() => recordData);
      });
  }

  function deleteRecord(row: any) {
    axios
      .delete(
        `https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/record/${row.id}`,
        { params: { "user.id": row.userId } }
      )
      .then(() => {
        updateRows();
      });
  }

  function editRecord(id: number, data: any) {
    axios
      .patch(
        `https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/record/${id}`,
        {
          value: data.value,
          type: data.type === "Gasto" ? 1 : 2,
          description: data.description,
          userId: 2,
        }
      )
      .then(() => {
        updateRows();
        handleClose();
      });
  }

  function createRecord(data: any) {
    axios
      .post(
        "https://economize-023-api-521a6e433d2a.herokuapp.com/api/v1/record",
        {
          value: data.value,
          type: data.type === "GASTO" ? 1 : 2,
          description: data.description,
          userId: 2,
        }
      )
      .then(() => updateRows());
  }

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
              renderCell: (cell) => {
                return (
                  <>
                    <DeleteIcon
                      onClick={() => deleteRecord(cell.row)}
                    ></DeleteIcon>
                    <EditIcon
                      onClick={() => handleOpen(cell.row as any)}
                    ></EditIcon>
                  </>
                );
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

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit(handleEditFormSubmit)}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  placeholder="Descrição"
                  fullWidth
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Controller
              name="value"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  variant="outlined"
                  placeholder="Valor"
                  fullWidth
                  style={{ marginBottom: "16px" }}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} fullWidth style={{ marginBottom: "16px" }}>
                  <MenuItem key={"gasto"} value={"Gasto"}>
                    Gasto
                  </MenuItem>
                  <MenuItem key={"renda"} value={"Renda"}>
                    Renda
                  </MenuItem>
                </Select>
              )}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Atualizar
            </Button>
          </form>
        </Box>
      </Modal>
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
