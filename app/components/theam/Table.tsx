'use client';

import { ReactNode } from 'react';

interface Column<T = Record<string, unknown>> {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T) => ReactNode;
}

interface TableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'outline' | 'cyanblue' | 'lime' | 'sunset' | 'dark' | 'elegant' | 'fuchsia' | 'sky' | 'ocean' | 'rose' | 'amethyst' | 'arctic' | 'skyblue' | 'turquoise' | 'neoncyan' | 'neonorange' | 'electriclime' | 'seafoam' | 'mintice' | 'watermelon' | 'plum' | 'magenta' | 'lavender' | 'violet';
}

const Table = <T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  size = 'md',
  variant = 'emerald'
}: TableProps<T>) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const paddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4'
  };

  const getTableContainerClasses = () => {
    switch (variant) {
      case 'outline':
        return 'rounded-lg shadow-md overflow-hidden border-b-4 border-blue-500';
      case 'cyanblue':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-cyan-500/20';
      case 'lime':
        return 'rounded-xl shadow-2xl shadow-lime-400/20 overflow-hidden border-2 border-lime-400/50';
      case 'sunset':
        return 'rounded-xl shadow-2xl overflow-hidden border-2 border-purple-500/30';
      case 'dark':
        return 'rounded-xl shadow-2xl overflow-hidden border-2 border-gray-700';
      case 'elegant':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-amber-500/30';
      case 'rose':
        return 'rounded-lg shadow-md overflow-hidden border-2 border-rose-200';
      case 'fuchsia':
        return 'rounded-2xl shadow-xl overflow-hidden border-2 border-fuchsia-500/30';
      case 'sky':
        return 'rounded-2xl shadow-lg overflow-hidden border-2 border-sky-300/40';
      case 'ocean':
        return 'rounded-3xl shadow-xl overflow-hidden border-2 border-teal-500/30';
      case 'amethyst':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-purple-500/30';
      case 'arctic':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-cyan-500/30';
      case 'skyblue':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-sky-400/30';
      case 'turquoise':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-teal-400/30';
      case 'neoncyan':
        return 'rounded-xl shadow-2xl shadow-cyan-400/20 overflow-hidden border-2 border-cyan-500/50';
      case 'neonorange':
        return 'rounded-xl shadow-2xl shadow-orange-500/20 overflow-hidden border-2 border-orange-500/50';
      case 'electriclime':
        return 'rounded-xl shadow-2xl shadow-lime-400/20 overflow-hidden border-2 border-lime-500/50';
      case 'seafoam':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-teal-300/30';
      case 'mintice':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-green-300/30';
      case 'watermelon':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-rose-400/30';
      case 'plum':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-purple-700/30';
      case 'magenta':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-fuchsia-600/30';
      case 'lavender':
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-purple-200/40';
      case 'violet':
        return 'rounded-xl shadow-xl overflow-hidden border-2 border-violet-500/30';
      case 'emerald':
      default:
        return 'rounded-xl shadow-lg overflow-hidden border-2 border-emerald-500/20';
    }
  };

  const getHeaderClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-blue-50 text-blue-700 border-b-4 border-blue-500 shadow-sm';
      case 'cyanblue':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md';
      case 'lime':
        return 'bg-gradient-to-r from-lime-400 to-green-500 text-white border-b-2 border-lime-500 shadow-lg shadow-lime-400/30';
      case 'sunset':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg';
      case 'dark':
        return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg';
      case 'elegant':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-b-2 border-rose-300 shadow-sm';
      case 'fuchsia':
        return 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-lg';
      case 'sky':
        return 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md';
      case 'ocean':
        return 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg';
      case 'amethyst':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-xl';
      case 'arctic':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg';
      case 'skyblue':
        return 'bg-gradient-to-r from-sky-300 to-blue-400 text-white shadow-md';
      case 'turquoise':
        return 'bg-gradient-to-r from-teal-300 to-cyan-500 text-white shadow-xl';
      case 'neoncyan':
        return 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white border-b-2 border-cyan-500 shadow-lg shadow-cyan-400/30';
      case 'neonorange':
        return 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-b-2 border-orange-500 shadow-lg shadow-orange-500/30';
      case 'electriclime':
        return 'bg-gradient-to-r from-lime-300 to-green-500 text-white border-b-2 border-lime-500 shadow-lg shadow-lime-400/30';
      case 'seafoam':
        return 'bg-gradient-to-r from-teal-200 to-green-300 text-gray-900 shadow-md';
      case 'mintice':
        return 'bg-green-300 text-gray-900 shadow-md';
      case 'watermelon':
        return 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-xl';
      case 'plum':
        return 'bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-xl';
      case 'magenta':
        return 'bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white shadow-xl';
      case 'lavender':
        return 'bg-gradient-to-r from-purple-200 to-violet-300 text-gray-900 shadow-md';
      case 'violet':
        return 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-xl';
      case 'emerald':
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md';
    }
  };

  const getRowClasses = (index: number) => {
    const baseClasses = 'transition-all duration-200';
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-blue-100/50 hover:shadow-sm' : ''}`;
      case 'cyanblue':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-cyan-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-cyan-100/50 hover:shadow-md' : ''}`;
      case 'lime':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-lime-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-lime-100 hover:shadow-md hover:shadow-lime-400/20' : ''}`;
      case 'sunset':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md' : ''}`;
      case 'dark':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} ${hoverable ? 'hover:bg-gray-700 hover:shadow-lg' : ''} text-white`;
      case 'elegant':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-amber-100/50 hover:shadow-md' : ''}`;
      case 'rose':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-rose-50/50' : 'bg-white'} ${hoverable ? 'hover:bg-rose-100/50 hover:shadow-sm' : ''}`;
      case 'fuchsia':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-fuchsia-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-fuchsia-100/50 hover:shadow-md' : ''}`;
      case 'sky':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-sky-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-sky-100 hover:shadow-sm' : ''}`;
      case 'ocean':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-teal-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-teal-100/50 hover:shadow-md' : ''}`;
      case 'amethyst':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-purple-100/50 hover:shadow-md' : ''}`;
      case 'arctic':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-cyan-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-cyan-100/50 hover:shadow-md' : ''}`;
      case 'skyblue':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-sky-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-sky-100/50 hover:shadow-sm' : ''}`;
      case 'turquoise':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-teal-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-teal-100/60 hover:shadow-md' : ''}`;
      case 'neoncyan':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-cyan-50/40' : 'bg-white'} ${hoverable ? 'hover:bg-cyan-100 hover:shadow-md hover:shadow-cyan-400/20' : ''}`;
      case 'neonorange':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-orange-50/40' : 'bg-white'} ${hoverable ? 'hover:bg-orange-100 hover:shadow-md hover:shadow-orange-400/20' : ''}`;
      case 'electriclime':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-lime-50/40' : 'bg-white'} ${hoverable ? 'hover:bg-lime-100 hover:shadow-md hover:shadow-lime-400/20' : ''}`;
      case 'seafoam':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-teal-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-teal-100/40 hover:shadow-sm' : ''}`;
      case 'mintice':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-green-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-green-100/50 hover:shadow-sm' : ''}`;
      case 'watermelon':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-rose-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-rose-100/50 hover:shadow-md' : ''}`;
      case 'plum':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-purple-50/40' : 'bg-white'} ${hoverable ? 'hover:bg-purple-100/60 hover:shadow-md' : ''}`;
      case 'magenta':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-fuchsia-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-fuchsia-100/50 hover:shadow-md' : ''}`;
      case 'lavender':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-purple-50/20' : 'bg-white'} ${hoverable ? 'hover:bg-purple-100/30 hover:shadow-sm' : ''}`;
      case 'violet':
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-violet-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-violet-100/50 hover:shadow-md' : ''}`;
      case 'emerald':
      default:
        return `${baseClasses} ${striped && index % 2 === 0 ? 'bg-emerald-50/30' : 'bg-white'} ${hoverable ? 'hover:bg-emerald-100/50 hover:shadow-md' : ''}`;
    }
  };

  const getCellTextColor = () => {
    if (variant === 'dark') {
      return 'text-white';
    }
    return 'text-gray-700';
  };

  return (
    <div className={`overflow-x-auto custom-scrollbar ${className}`}>
      <div className={` w-full min-w-[1200px] ${getTableContainerClasses()}`}>
        <table className="w-full">
          {/* Header */}
          <thead className={getHeaderClasses()}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${paddingClasses[size]}
                    ${sizeClasses[size]}
                    font-bold tracking-wide
                    ${bordered ? 'border-r border-white/20 last:border-r-0' : ''}
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((record, index) => (
              <tr
                key={index}
                className={`
                  ${getRowClasses(index)}
                  ${bordered ? 'border-b border-gray-200 last:border-b-0' : ''}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      ${paddingClasses[size]}
                      ${sizeClasses[size]}
                      ${getCellTextColor()}
                      font-medium
                      ${bordered ? 'border-r border-gray-200 last:border-r-0' : ''}
                      ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {column.render ? column.render(record[column.key], record) : String(record[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
