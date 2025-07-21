import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

interface Props {
  id: string; // Changed from function to string
  onSuccess?: () => void; // Optional callback after successful edit
}

const EditInventoryForm = ({ id, onSuccess }: Props) => {
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
        const response = await axios.put(
          `http://127.0.0.1:8000/api/inventory/${id}/update/`,
          {
            inventory_name: values.name,
            category: values.category,
            quantity: values.quantity,
            expiry: values.expiryDate,
          }
        );

        toast.success("Inventory successfully updated");
        setTimeout(() => {
          window.location.reload();
        }, 500);

        if (onSuccess) onSuccess(); // Call success callback if provided
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update inventory. Please try again.");
      }
    },
  });

  // Fetch inventory data when component mounts or ID changes
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/inventory/get/${id}/`
        );
        const inventory = response.data;

        // Set form values with fetched data
        formik.setValues({
          name: inventory.inventory_name,
          category: inventory.category,
          quantity: inventory.quantity,
          expiryDate: inventory.expiry?.split("T")[0] || "", // Handle date format
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load inventory data");
      }
    };

    if (id) {
      fetchInventory();
    }
  }, [id]);

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Inventory</h2>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={formik.handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            value={formik.values.category}
          >
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditInventoryForm;
