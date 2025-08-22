import { Chip, MenuItem, Select } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { getStatusColor } from "./statusUi";
import { getOrderDateColor } from "./dateUi";
import { useOrders } from "../hooks/orderHooks/useOrder";
import { OrderStatus, ORDER_STATUSES } from "../interfaces/data";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";


export const columns: GridColDef[] = [
  { field: "id", headerName: "Order ID", width: 90 },
  {
    field: "products",
    headerName: "Products",
    width: 300,
    sortable: false,
    renderCell: (params) => (
      <span>
        {params.row.orderItems
          .map((item: any) => `${item.product.name} (x${item.quantity})`)
          .join(", ")}
      </span>
    ),
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 120,
    renderCell: (params) => (
      <Chip label={`$${params.row.totalAmount}`} variant="outlined" />
    ),
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
    field: "address",
    headerName: "Address",
    width: 190,
    sortable: false,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Order Date",
    width: 150,
    renderCell: (params) => {
      const rawDate = new Date(params.row.createdAt);
      const formattedDate = rawDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      const color = getOrderDateColor(params.row.createdAt);
      return <span style={{ color }}>{formattedDate}</span>;
    },
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key="edit"
        label="Edit"
        icon={<EditOutlined color="inherit" />}
        onClick={() => onDelete(row)}
      />,
      <GridActionsCellItem
        key="delete"
        label="Delete"
        icon={<DeleteOutline color="error" />}
        onClick={() => onDelete(row.id)}
      />,
    ],
  },
];
export const Acolumns: GridColDef[] = [
  { field: "id", headerName: "Order ID", width: 90 },
  {
    field: "products",
    headerName: "Products",
    width: 300,
    sortable: false,
    renderCell: (params) => (
      <span>
        {params.row.orderItems
          .map((item: any) => `${item.product.name} (x${item.quantity})`)
          .join(", ")}
      </span>
    ),
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 120,
    renderCell: (params) => (
      <Chip label={`$${params.row.totalAmount}`} variant="outlined" />
    ),
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
    field: "address",
    headerName: "Address",
    sortable: false,
    width: 190,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Order Date",
    width: 150,
    renderCell: (params) => {
      const rawDate = new Date(params.row.createdAt);
      const formattedDate = rawDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      const color = getOrderDateColor(params.row.createdAt);
      return <span style={{ color }}>{formattedDate}</span>;
    },
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key="edit"
        label="Edit"
        icon={<EditOutlined color="inherit" />}
        onClick={() => onEdit(row)}
      />,
      <GridActionsCellItem
        key="delete"
        label="Delete"
        icon={<DeleteOutline color="error" />}
        onClick={() => onDelete(row.id)}
      />,
    ],
  },
];
