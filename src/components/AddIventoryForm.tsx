import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface Props {
  close: () => void;
}
const InventoryForm = ({ close }: Props) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      quantity: "",
      expiryDate: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(100, "Name must be 100 characters or less")
        .required("Name is required"),
      category: Yup.string().required("Category is required"),
      quantity: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      expiryDate: Yup.date(),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/inventory/create",
          {
            inventory_name: values.name,
            category: values.category,
            user: "1",
            quantity: values.quantity,
            expiry: values.expiryDate,
          }
        );

        toast.success("Inventory successfully added");
      } catch (error) {
        toast.error("Inventory not added, try again");
      }
    },
  });

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Inventory Form</h2>
      <ToastContainer />

      <form onSubmit={formik.handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              formik.errors.name && formik.touched.name
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="Enter item name"
          />
          {formik.errors.name && formik.touched.name ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.name}
            </div>
          ) : null}
        </div>

        {/* Category Field */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`w-full px-3 py-2 border rounded-md ${
              formik.errors.category && formik.touched.category
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}>
            <option value="">Select a category</option>
            <option value="furniture">Furniture</option>
            <option value="books">Books & Educational Materials</option>
            <option value="technology">Technology</option>
            <option value="science">Science & Lab Equipment</option>
            <option value="sports">Sports & PE Equipment</option>
            <option value="arts">Arts & Music</option>
            <option value="stationery">Stationery & Supplies</option>
            <option value="maintenance">Maintenance Tools</option>
            <option value="first_aid">First Aid & Medical</option>
            <option value="transport">Transportation</option>
            <option value="other">Other</option>
          </select>
          {formik.errors.category && formik.touched.category ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.category}
            </div>
          ) : null}
        </div>

        {/* Quantity Field */}
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            className={`w-full px-3 py-2 border rounded-md ${
              formik.errors.quantity && formik.touched.quantity
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
            placeholder="Enter quantity"
          />
          {formik.errors.quantity && formik.touched.quantity ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.quantity}
            </div>
          ) : null}
        </div>

        {/* Expiry Date Field */}
        <div className="mb-6">
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            className={`w-full px-3 py-2 border rounded-md ${
              formik.errors.expiryDate && formik.touched.expiryDate
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.expiryDate}
          />
          {formik.errors.expiryDate && formik.touched.expiryDate ? (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.expiryDate}
            </div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          disabled={!formik.isValid || formik.isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default InventoryForm;
