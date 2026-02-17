'use client';

interface MoneyDisplayProps {
  amount: number;
  showUnit?: boolean;
  compact?: boolean;
}

export function MoneyDisplay({ amount, showUnit = true, compact = false }: MoneyDisplayProps) {
  const crore = amount / 10000000; // Convert paisa/rupees to crore if needed
  const formatted = amount >= 10000000
    ? `₹${(amount / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`
    : amount >= 100000
    ? `₹${(amount / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} L`
    : `₹${amount.toLocaleString('en-IN')}`;

  return <span className="font-mono">{formatted}</span>;
}
