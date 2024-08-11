import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface CurrencyTextFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CurrencyTextField: React.FC<CurrencyTextFieldProps> = ({ value, onChange }) => {

  const formatCurrency = (value: string): string => {
    const num = value.replace(/[^0-9]/g, ""); // remove all non-numeric characters
    const formattedValue = (parseInt(num, 10) / 100).toFixed(2).replace('.',','); // divide by 100 to move decimal and format to 2 decimals
    return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // add thousands separator
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(event.target.value);
    onChange(formattedValue); // call the passed-in onChange handler with the formatted value
  };

  return (
    <TextField
      type="text"
      variant="outlined"
      value={value}
      onChange={handleChange}
      placeholder="Valor"
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>, // adjust the currency symbol as needed
      }}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default CurrencyTextField;
