import { Chip, MenuItem, Select } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { getStatusColor } from "./statusUi";
import { getOrderDateColor } from "./dateUi";
import { useOrders } from "../hooks/orderHooks/useOrder";
import { OrderStatus, ORDER_STATUSES } from "../interfaces/data";

export const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 90 },
    {
        field: 'products',
        headerName: 'Products',
        width: 300,
        sortable: false,
        renderCell: (params) => (
            <span>
                {params.row.orderItems
                    .map((item: any) => `${item.product.name} (x${item.quantity})`)
                    .join(', ')}
            </span>
        ),
    },
    {
        field: 'totalAmount',
        headerName: 'Total Amount',
        width: 120,
        renderCell: (params) => <Chip label={`$${params.row.totalAmount}`} variant="outlined" />,
    },
    {
        field: "status",
        headerName: "Status",
        width: 200,
        renderCell: (params) => {
            const { updateOrderStatus, loading } = useOrders();
            return (
                <Select<OrderStatus>
                    value={params.row.status}
                    onChange={(e) =>
                        updateOrderStatus(params.row.id, e.target.value as OrderStatus)
                    }
                    size="small"
                    disabled={loading} // Use the passed-down loading state
                >
                    {ORDER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                            <Chip
                                label={status}
                                color={getStatusColor(status)}
                                variant="filled"
                            />
                        </MenuItem>
                    ))}
                </Select>
            );
        },
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 190,

    },
    {
        field: 'phone',
        headerName: 'Phone',
        width: 150,
    },
    {
        field: 'createdAt',
        headerName: 'Order Date',
        width: 150,
        renderCell: (params) => {
            const rawDate = new Date(params.row.createdAt);
            const formattedDate = rawDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const color = getOrderDateColor(params.row.createdAt);
            return <span style={{ color }}>{formattedDate}</span>;
        },
    },
];
export const Acolumns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 90 },
    {
        field: 'products',
        headerName: 'Products',
        width: 300,
        sortable: false,
        renderCell: (params) => (
            <span>
                {params.row.orderItems
                    .map((item: any) => `${item.product.name} (x${item.quantity})`)
                    .join(', ')}
            </span>
        ),
    },
    {
        field: 'totalAmount',
        headerName: 'Total Amount',
        width: 120,
        renderCell: (params) => <Chip label={`$${params.row.totalAmount}`} variant="outlined" />,
    },
    {
        field: "status",
        headerName: "Status",
        width: 200,
        renderCell: (params) => {
            const { updateOrderStatus, loading } = useOrders();
            return (
                <Select<OrderStatus>
                    value={params.row.status}
                    onChange={(e) =>
                        updateOrderStatus(params.row.id, e.target.value as OrderStatus)
                    }
                    size="small"
                    disabled={loading} // Use the passed-down loading state
                >
                    {ORDER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                            <Chip
                                label={status}
                                color={getStatusColor(status)}
                                variant="filled"
                            />
                        </MenuItem>
                    ))}
                </Select>
            );
        },
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 190,

    },
    {
        field: 'phone',
        headerName: 'Phone',
        width: 150,
    },
    {
        field: 'createdAt',
        headerName: 'Order Date',
        width: 150,
        renderCell: (params) => {
            const rawDate = new Date(params.row.createdAt);
            const formattedDate = rawDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const color = getOrderDateColor(params.row.createdAt);
            return <span style={{ color }}>{formattedDate}</span>;
        },
    },
];