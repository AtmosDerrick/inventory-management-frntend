import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

interface ReleaseFormProps {
  inventoryItem: {
    id: string;
    name: string;
    currentQuantity: number;
  };
  onSuccess?: () => void;
  close?: () => void;
}

const InventoryReleaseForm = ({
  inventoryItem,
  onSuccess,
}: ReleaseFormProps) => {
  const formik = useFormik({
    initialValues: {
      quantity: "",
      destination: "",
      reason: "",
    },
    validationSchema: Yup.object({
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Must release at least 1 item")
        .max(
          inventoryItem.currentQuantity,
          `Cannot release more than available (${inventoryItem.currentQuantity})`
        ),
      destination: Yup.string()
        .required("Destination is required")
        .max(100, "Destination must be 100 characters or less"),
      reason: Yup.string()
        .required("Reason is required")
        .max(200, "Reason must be 200 characters or less"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/inventory/release/${inventoryItem.id}`,
          {
            quantity: values.quantity,
            destination: values.destination,
            reason: values.reason,
            user: "1",
            // released_by will be handled by the backend via authentication
          }
        );

        toast.success(
          `Successfully released ${values.quantity} ${inventoryItem.name}(s)`
        );
        if (onSuccess) onSuccess();
        close();
      } catch (error: any) {
        let errorMessage = "Failed to release inventory. Please try again.";

        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            errorMessage;
        }

        toast.error(errorMessage);
        console.error("Release error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">
        Release {inventoryItem.name}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Available: {inventoryItem.currentQuantity}
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Quantity Field */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1">
            Quantity to Release *
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max={inventoryItem.currentQuantity}
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.quantity && formik.errors.quantity
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
          />
          {formik.touched.quantity && formik.errors.quantity ? (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.quantity}
            </p>
          ) : null}
        </div>

        {/* Destination Field */}
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1">
            Destination *
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.destination && formik.errors.destination
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.destination}
            placeholder="Where is this being released to?"
          />
          {formik.touched.destination && formik.errors.destination ? (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.destination}
            </p>
          ) : null}
        </div>

        {/* Reason Field */}
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Release *
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.reason && formik.errors.reason
                ? "border-red-500"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reason}
            placeholder="Why is this being released?"
          />
          {formik.touched.reason && formik.errors.reason ? (
            <p className="mt-1 text-sm text-red-600">{formik.errors.reason}</p>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
          {formik.isSubmitting ? "Processing..." : "Release Inventory"}
        </button>
      </form>
    </div>
  );
};

export default InventoryReleaseForm;
