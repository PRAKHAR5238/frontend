import { useFetchData } from "6pp";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { SkeletonLoader } from "../../../components/loader";
import { RootState, server } from "../../../redux/store";
import { SingleDiscountResponse } from "../../../types/api-types";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id || !user?._id) {
    return <div>Error: Coupon ID or User ID is missing.</div>;
  }

  const {
    loading: isLoading,
    data,
    error,
  } = useFetchData<SingleDiscountResponse>({
    url: `${server}/api/v1/coupon/${id}?id=${user._id}`,
    key: "single-discount",
    dependencyProps: [id, user._id],
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [btnLoading, setBtnLoading] = useState(false);
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/v1/coupon/${id}?id=${user._id}`,
        { code, discountValue },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate(0); // Refresh the current page
      }
    } catch (error: any) {
      console.error("Update Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setCode(data.coupon.code);
      setDiscountValue(data.coupon.discountValue);
    }
  }, [data]);

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const { data } = await axios.delete(
        `${server}/api/v1/coupon/${id}?id=${user._id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/discount"); // Navigate back after delete
      }
    } catch (error: any) {
      console.error("Delete Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <SkeletonLoader length={20} />
        ) : (
          <article>
            <button
              type="button"
              className="product-delete-btn"
              onClick={deleteHandler}
              disabled={btnLoading}
            >
              <FaTrash />
            </button>

            <form onSubmit={submitHandler}>
              <h2>Manage</h2>

              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <label>Discount Value</label>
                <input
                  type="number"
                  placeholder="Discount Value"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </div>

              <button disabled={btnLoading} type="submit">
                Update
              </button>
            </form>
          </article>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;
