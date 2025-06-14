import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { SkeletonLoader } from "../../components/loader";

import { CustomError } from "../../types/api-types";
import { useAllOrdersQuery } from "../../redux/api/Orderapi";
import { userReducerinitialstate } from "../../types/reducer-types";
import Avatar from "@mui/material/Avatar";

interface DataType {
  user: ReactElement; // <-- updated from string to ReactElement
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { user, loading } = useSelector(
    (state: { user: userReducerinitialstate }) => state.user
  );

  const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (user && isError && error) {
      const err = error as CustomError;
      const message =
        err?.data?.message || "An unexpected error occurred. Please try again.";
      toast.error(message);
    }
  }, [isError, error, user]);

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i: any) => ({
          user: (
            <div className="flex items-center gap-2">
              <Avatar
                src={i.user?.photo || ""}
                alt={i.name}
                sx={{ width: 40, height: 40 }}
              />
              <span>{i.name}</span>
            </div>
          ),
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading || !user ? <SkeletonLoader length={20} /> : Table}</main>
    </div>
  );
};

export default Transaction;
