import { useFetchData } from "6pp";
import { Skeleton } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import TableHOC from "../../../components/admin/TableHOC";
import { RootState, server } from "../../../redux/store";
import { AllDiscountResponse } from "../../../types/api-types";
import { SkeletonLoader } from "../../../components/loader";

type DataType = {
  code: string;
  amount: number;
  _id: string;
  action: ReactElement;
};

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Discount = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?._id;
  
    // Don't attempt to fetch data if userId is undefined
    if (!userId) {
      return <div>No user found</div>; // or a loading/error state
    }

  const {
    data,
    loading: isLoading,
    error,
  } = useFetchData<AllDiscountResponse>({
    url: `${server}/api/v1/coupon/allcoupons?id=${userId}`,
    key: "discount-codes",
    dependencyProps: [userId],
  });

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Discount Codes",
    rows.length > 6
  )();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (data) {
      setRows(
        data.coupons.map((i) => ({
          _id: i._id,
          code: i.code,
          amount: i.discountValue,
          action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
      <Link to="/admin/discount/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Discount;
