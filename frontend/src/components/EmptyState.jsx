const EmptyState = ({ message = "No data found" }) => (
  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
    <p>{message}</p>
  </div>
);

export default EmptyState;
