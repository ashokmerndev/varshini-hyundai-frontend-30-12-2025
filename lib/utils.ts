import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'In Stock':
      return 'text-green-500'
    case 'Low Stock':
      return 'text-yellow-500'
    case 'Out of Stock':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'Placed':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'Confirmed':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'Packed':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'Shipped':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'Delivered':
      return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'Cancelled':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}
