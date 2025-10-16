import { PricingSectionNew } from '../ui/components/PricingSectionNew';
import { ThemeToggle } from '../ui/components/ThemeToggle';

export function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* <ThemeToggle /> */}
      <PricingSectionNew />
    </div>
  );
}