export default function LoadingState({ label = 'Loading Travel Wise...' }: { label?: string }) {
  return (
    <section className="flex min-h-[280px] items-center justify-center">
      <section className="text-center">
        <section className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      </section>
    </section>
  );
}
