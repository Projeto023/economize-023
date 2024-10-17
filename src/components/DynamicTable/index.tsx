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
  Chip,
} from "@mui/material";
import { DataGrid, GridRowHeightParams } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TotalValueSummary from "../TotalValueSummary";
import CurrencyTextField from "../CurrencyTextField";
import { useUserContext } from "../../context/UserContext";
import axiosInstance from "../../config/axiosConfig";
import styles from "./index.module.css";

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
  {
    id: 5,
    formattedName: "Etiquetas",
    rowname: "tags",
    dataFormat: "tags",
    isSelect: false,
  },
];

const DynamicTable = () => {
  const { user } = useUserContext();
  const [rows, setRows] = useState<RowData[]>([]);
  const { handleSubmit, control, setValue } = useForm();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<RowData | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const handleFormSubmit = (data: any) => {
    createRecord(data);
  };

  const handleEditFormSubmit = (data: any) => {
    if (editData) {
      editRecord(editData.id, data);
    }
  };

  const handleOpen = (row: RowData) => {
    const capitalizedType: string =
      row.type[0].toUpperCase() + row.type.slice(1).toLowerCase();
    const onlyDate: string = String(row.date).split("T")[0];

    setEditData(row);
    setValue("description", row.description);
    setValue("value", row.value);
    setValue("type", capitalizedType);
    setValue("date", onlyDate);
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
            tags: any[];
          }) => {
            return {
              id: record.id,
              value: record.value,
              date: record.recordDate,
              description: record.description,
              type: record.type === 1 ? "GASTO" : "RENDA",
              userId: record.userId,
              tags: record.tags,
            } as RowData;
          }
        );

        setRows(() =>
          recordData.sort((a: any, b: any) => {
            const dateA: number = new Date(a.date).getTime();
            const dateB: number = new Date(b.date).getTime();
            return dateB - dateA;
          })
        );
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
      value: parseFloat(data.value.replaceAll(".", "").replaceAll(",", ".")),
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

  function handleDeleteTag(tag: any) {
    return null;
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
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        getRowHeight={(row: GridRowHeightParams) => {
          if (row.model.tags.length > 3) {
            const len = row.model.tags.length;
            return (len / 3) * 50;
          }
          return null;
        }}
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
              valueFormatter: (value: number) =>
                `R$${value
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            };
          } else if (definition.dataFormat === "date") {
            return {
              field: definition.rowname,
              headerName: definition.formattedName,
              width: 150,
              key: index,
              valueFormatter: (value: string) =>
                value ? value.split("T")[0] : "",
            };
          } else if (definition.dataFormat === "tags") {
            return {
              field: definition.rowname,
              headerName: definition.formattedName,
              width: 300,
              key: index,
              renderCell: (cell) => {
                return (
                  <div style={{ lineHeight: 2, paddingTop: 10 }}>
                    {cell.row.tags.map((tag: any, index: number) => (
                      <>
                        {index % 3 === 0 && index != 0 ? <br /> : <></>}
                        <Chip
                          color="primary"
                          size="small"
                          onDelete={handleDeleteTag}
                          label={tag.name}
                        />
                      </>
                    ))}
                  </div>
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
      <div className={styles.div_registro}>
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
          defaultValue="0,00"
          render={({ field }) => (
            <CurrencyTextField
              value={field.value}
              onChange={(value) => field.onChange(value)} // Pass the value to the react-hook-form controller
            />
          )}
        />

        <Controller
          name={`date`}
          control={control}
          defaultValue={today}
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

            <Controller
              name="date"
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
