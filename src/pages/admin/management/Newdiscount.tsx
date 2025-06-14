import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate,  } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { RootState, server } from "../../../redux/store";

const Newdiscount = () => {
  const { user } = useSelector((state: RootState) => state.user);
 
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
  `${server}/api/v1/coupon/newcoupon?id=${user?._id}`,
  { code, discountValue },
  {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  }
);
toast.success("Discount created successfully");

      if (data.success) {
        toast.success(data.message);
        navigate(0); // Refresh current page
      }
    } catch (error: any) {
      console.error("Create Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Coupon</h2>

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
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Newdiscount;
