import { BadgeVariant } from '@/types/commonType';
import { ReactNode } from 'react';


interface IBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-900/50 text-green-400 border border-green-800',
  warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  danger: 'bg-red-900/50 text-red-400 border border-red-800',
  info: 'bg-blue-200/50 text-blue-400 border border-blue-800',
};

const  Badge = (props: IBadgeProps) => {
  const { children, variant = 'default', className = '' } = props;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
export default Badge;
