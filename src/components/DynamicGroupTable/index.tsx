import {
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
  Typography,
  Tabs,
  Tab
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TotalValueSummary from "../TotalValueSummary";
import { useUserContext } from "../../context/UserContext";
import axiosInstance from "../../config/axiosConfig";
import DynamicTabs from "../Tab";

interface RowData {
  id: number;
  description: string;
  value: number;
  type: string;
  date: Date;
  userId: number;
}

interface DynamicGroupTableProps {
  groupId: number;
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
    formattedName: "Autor",
    rowname: "userName",
    dataFormat: "text",
    isSelect: false,
  }
];

const DynamicGroupTable: React.FC<DynamicGroupTableProps> = ({groupId}) => {
  const { user } = useUserContext();
  const [rows, setRows] = useState<RowData[]>([]);
  const { handleSubmit, control, setValue } = useForm();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<RowData | null>(null);

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
    axiosInstance
      .get(
        "/api/v1/group/records",
        { params: { "group.id": groupId } }
      )
      .then((response) => {
        const recordData = response.data.records.map(
          (record: {
            id: number;
            value: any;
            recordDate: any;
            type: any;
            description: string;
            userId: number;
            userName: string
          }) => {
            return {
              id: record.id,
              value: record.value,
              date: record.recordDate,
              description: record.description,
              type: record.type === 1 ? "GASTO" : "RENDA",
              userId: record.userId,
              userName: record.userName
            } as RowData;
          }
        );

        setRows(() => recordData);
      });
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
          if (definition.dataFormat === "currency") {
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
    </div>
  );
};

export default DynamicGroupTable;
