import {
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TotalValueSummary from "../TotalValueSummary";
import { useUserContext } from "../../context/UserContext";
import axiosInstance from "../../config/axiosConfig";

interface RowData {
  id: number;
  description: string;
  value: number;
  type: string;
  date: Date;
  userId: number;
}

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
    dataFormat: "currency",
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

const DynamicTable = () => {
  const { user } = useUserContext();
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
    setValue("date", row.date);
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
    axiosInstance
      .get("/api/v1/user/records", { params: { "user.id": user.id } })
      .then((response) => {
        const recordData = response.data.records.map(
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
              value: record.value,
              date: record.recordDate,
              description: record.description,
              type: record.type === 1 ? "GASTO" : "RENDA",
              userId: record.userId,
            } as RowData;
          }
        );

        setRows(() => recordData);
      });
  }

  function deleteRecord(row: any) {
    axiosInstance
      .delete(`/api/v1/record/${row.id}`, { params: { "user.id": user.id } })
      .then(() => {
        updateRows();
      });
  }

  function editRecord(id: number, data: any) {
    axiosInstance
      .patch(`/api/v1/record/${id}`, {
        value: data.value,
        type: data.type === "Gasto" ? 1 : 2,
        description: data.description,
        userId: user.id,
      })
      .then(() => {
        updateRows();
        handleClose();
      });
  }

  function createRecord(data: any) {
    const recordToBeCreated = {
      value: data.value,
      type: data.type.toUpperCase() === "GASTO" ? 1 : 2,
      description: data.description,
      userId: user.id,
      recordDate: data.date,
    };

    const isValidRecord = Object.values(recordToBeCreated).every(
      (value) => value !== null && value !== undefined && value !== ""
    );

    if (isValidRecord) {
      axiosInstance
        .post("/api/v1/record", recordToBeCreated)
        .then(() => updateRows());
    } else {
      console.error("One or more fields are missing or invalid");
    }
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
          } else if (definition.dataFormat === "currency") {
            return {
              field: definition.rowname,
              headerName: definition.formattedName,
              width: 150,
              key: index,
              valueFormatter: (value) => `R$${value}`,
            };
          } else if (definition.dataFormat === "date") {
            return {
              field: definition.rowname,
              headerName: definition.formattedName,
              width: 150,
              key: index,
              valueFormatter: (value: string) => value.split("T")[0],
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
          justifyContent: "space-between",
          paddingTop: "1em",
        }}
      >
        <Controller
          name={`type`}
          control={control}
          defaultValue="Gasto"
          render={({ field }) => (
            <Select
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value || "Gasto"}
              style={{ backgroundColor: "white" }}
              defaultValue={"Gasto"}
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
          name={`date`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              variant="outlined"
              onChange={(e) => field.onChange(e.target.value)}
              style={{ backgroundColor: "white" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />

        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="primary"
        >
          Adicionar
        </Button>
      </div>

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
              defaultValue="Gasto"
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

            <Controller
              name={`date`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  variant="outlined"
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ backgroundColor: "white" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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

export default DynamicTable;
