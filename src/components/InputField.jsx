const InputField = ({ label, id, formik, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-2">
            {label}
        </label>
        <input
            id={id}
            name={id}
            {...props}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                formik.touched[id] && formik.errors[id]
                    ? "border-red-500"
                    : "border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[id]}
        />
        {formik.touched[id] && formik.errors[id] && (
            <p className="text-red-400 text-sm mt-1">{formik.errors[id]}</p>
        )}
    </div>
);

export default InputField;