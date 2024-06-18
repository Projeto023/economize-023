import {
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TotalValueSummary from "../TotalValueSummary";
import { useUserContext } from "../../context/UserContext";

interface RowData {
  id: number;
  description: string;
  value: string;
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
        { params: { "user.id": user.id } }
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
        { params: { "user.id": user.id } }
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
          userId: user.id,
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
          userId: user.id,
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

export default DynamicTable;
