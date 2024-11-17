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
  Autocomplete,
  AutocompleteRenderInputParams,
  createFilterOptions,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
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
  tags: TagData[];
}

interface TagData {
  id: number;
  isDefault: boolean;
  name: string;
  updateAt: Date;
  createAt: Date;
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

interface TagInterface {
  inputValue?: string;
  id: number;
  description: string;
  exists: boolean;
}

const DynamicTable = () => {
  const { handleSubmit, control, setValue } = useForm();
  const { user } = useUserContext();
  const today = new Date().toISOString().split("T")[0];
  const [rows, setRows] = useState<RowData[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<RowData | null>(null);
  const [tagInputValue, setTagInputValue] = useState("");
  const [selectedTagList, setSelectedTagList] = useState([] as TagInterface[]);
  const [tagList, setTagList] = useState([] as TagInterface[]);
  const [defaultRowTagLost, setDefaultRowTagLost] = useState(
    [] as TagInterface[]
  );

  const getAllTagsFromUser = () => {
    axiosInstance.get(`/api/v1/tag?user.id=${user.id}`).then((response) => {
      const tagList: TagInterface[] = response.data.records.map((tag: any) => ({
        id: tag.id,
        description: tag.name,
        exists: true,
      }));
      setTagList(tagList);
    });
  };

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
    const tags: TagInterface[] = row.tags.map(
      (tag: TagData) =>
        ({ description: tag.name, exists: true, id: tag.id } as TagInterface)
    );

    setEditData(row);
    setValue("description", row.description);
    setValue("value", row.value);
    setValue("type", capitalizedType);
    setValue("date", onlyDate);
    setDefaultRowTagLost(tags);
    setSelectedTagList(tags);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  useEffect(() => {
    updateRows();
    getAllTagsFromUser();
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
        tags: {
          tagNames: selectedTagList
            .filter((tag) => !tag.exists)
            .map((filteredTags) => filteredTags.description),
          tagIds: selectedTagList
            .filter((tag) => tag.exists)
            .map((filteredTags) => filteredTags.id),
        },
      })
      .then(() => {
        updateRows();
        clearFields();
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
      tags: {
        tagNames: selectedTagList
          .filter((tag) => !tag.exists)
          .map((filteredTags) => filteredTags.description),
        tagIds: selectedTagList
          .filter((tag) => tag.exists)
          .map((filteredTags) => filteredTags.id),
      },
    };

    const isValidRecord = Object.values(recordToBeCreated).every(
      (value) => value !== null && value !== undefined && value !== ""
    );

    if (isValidRecord) {
      axiosInstance.post("/api/v1/record", recordToBeCreated).then(() => {
        updateRows();
        clearFields();
      });
    } else {
      console.error("One or more fields are missing or invalid");
    }
  }

  function clearFields() {
    /* setSelectedTagList([]);
    setValue("description", null);
    setValue("value", null);
    setValue("type", null);
    setValue("date", null); */
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
                        <Chip color="primary" size="small" label={tag.name} />
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

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              fullWidth
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              freeSolo
              style={{ backgroundColor: "white" }}
              getOptionLabel={(option: string | TagInterface) =>
                typeof option === "string" ? option : option.description
              }
              isOptionEqualToValue={(
                option: TagInterface,
                value: TagInterface
              ) => option.id === value.id}
              options={
                tagInputValue &&
                !tagList.some(
                  (tag: TagInterface) => tag.description === tagInputValue
                )
                  ? [
                      ...tagList,
                      {
                        id:
                          tagList.length < 1
                            ? 1
                            : tagList.reduce(
                                (max, item) => (item.id > max ? item.id : max),
                                tagList[0].id
                              ) + 1,
                        description: `Adicionar ${tagInputValue}`,
                        exists: false,
                      },
                    ]
                  : tagList
              }
              renderTags={(value: readonly TagInterface[], getTagProps) =>
                value.map((option: TagInterface, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      label={option.description}
                      key={key}
                      {...tagProps}
                    />
                  );
                })
              }
              inputValue={tagInputValue}
              onInputChange={(
                event: React.SyntheticEvent,
                newInputValue: string
              ) => {
                setTagInputValue(newInputValue);
              }}
              onChange={(
                event: React.SyntheticEvent,
                newValue: (string | TagInterface)[],
                reason: AutocompleteChangeReason,
                details?: AutocompleteChangeDetails<TagInterface>
              ) => {
                const lastValue = newValue[newValue.length - 1];
                if (typeof lastValue === "string") {
                } else {
                  if (lastValue?.description.includes("Adicionar")) {
                    lastValue.description = lastValue.description.slice(9);
                    setTagList([...tagList, lastValue]);
                    newValue[newValue.length - 1] = lastValue;
                  }
                  setSelectedTagList(newValue as TagInterface[]);
                }
              }}
              defaultValue={defaultRowTagLost}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Etiquetas"
                  placeholder="Insira suas etiquetas"
                />
              )}
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
                  fullWidth
                  type="date"
                  variant="outlined"
                  onChange={(e) => field.onChange(e.target.value)}
                  style={{ backgroundColor: "white", marginBottom: "16px" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  freeSolo
                  style={{ backgroundColor: "white", marginBottom: "16px" }}
                  getOptionLabel={(option: string | TagInterface) =>
                    typeof option === "string" ? option : option.description
                  }
                  isOptionEqualToValue={(
                    option: TagInterface,
                    value: TagInterface
                  ) => option.id === value.id}
                  options={
                    tagInputValue &&
                    !tagList.some(
                      (tag: TagInterface) => tag.description === tagInputValue
                    )
                      ? [
                          ...tagList,
                          {
                            id:
                              tagList.length < 1
                                ? 1
                                : tagList.reduce(
                                    (max, item) =>
                                      item.id > max ? item.id : max,
                                    tagList[0].id
                                  ) + 1,
                            description: `Adicionar ${tagInputValue}`,
                            exists: false,
                          },
                        ]
                      : tagList
                  }
                  renderTags={(value: readonly TagInterface[], getTagProps) =>
                    value.map((option: TagInterface, index: number) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          variant="outlined"
                          label={option.description}
                          key={key}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  inputValue={tagInputValue}
                  onInputChange={(
                    event: React.SyntheticEvent,
                    newInputValue: string
                  ) => {
                    setTagInputValue(newInputValue);
                  }}
                  onChange={(
                    event: React.SyntheticEvent,
                    newValue: (string | TagInterface)[],
                    reason: AutocompleteChangeReason,
                    details?: AutocompleteChangeDetails<TagInterface>
                  ) => {
                    const lastValue = newValue[newValue.length - 1];
                    if (typeof lastValue === "string") {
                    } else {
                      if (lastValue?.description.includes("Adicionar")) {
                        lastValue.description = lastValue.description.slice(9);
                        setTagList([...tagList, lastValue]);
                        newValue[newValue.length - 1] = lastValue;
                      }
                      setSelectedTagList(newValue as TagInterface[]);
                    }
                  }}
                  defaultValue={defaultRowTagLost}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Etiquetas"
                      placeholder="Insira suas etiquetas"
                    />
                  )}
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
