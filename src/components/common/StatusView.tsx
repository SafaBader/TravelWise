interface StatusViewProps {
  title: string;
  message: string;
  action?: React.ReactNode;
}

export default function StatusView({ title, message, action }: StatusViewProps) {
  return (
    <section className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-300">{message}</p>
      {action ? <section className="mt-6">{action}</section> : null}
    </section>
  );
}
