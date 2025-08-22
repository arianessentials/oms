// src/components/_partials/OrdersTable.tsx

import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { columns } from "@/app/utility/gridColDef";
const theme = createTheme();

interface OrdersTableProps {
  loading: boolean;
  error: { message?: string } | null;
  rows: any[];
  deleteOrderById: void,
}

export default function OrdersTable({
  loading,
  error,
  rows,
  deleteOrderById,
}: OrdersTableProps) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "80vw" }}>
        <DataGrid
          key={JSON.stringify(rows.map((row) => row.id))}
          rows={rows}
          columns={columns}
          deleteOrderById={deleteOrderById}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
