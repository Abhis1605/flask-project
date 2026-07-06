export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-400 sm:px-6 dark:border-slate-800">
      &copy; {year} Inventory Management. All rights reserved.
    </footer>
  );
}
