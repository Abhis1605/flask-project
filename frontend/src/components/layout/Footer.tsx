export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-400 sm:px-6 dark:border-slate-800">
      &copy; {year} <span className="text-indigo-500 font-semibold">Inventory Management</span>. All rights reserved.
    </footer>
  );
}
