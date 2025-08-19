'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { columns } from '@/app/utility/gridColDef';

const theme = createTheme();

interface OrdersTableProps {
    loading: boolean;
    error: { message?: string } | null;
    rows: any[];
}

export default function OrdersTable({ loading, error, rows }: OrdersTableProps) {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '80vw' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                />
            </Box>
        </ThemeProvider>
    );
}
