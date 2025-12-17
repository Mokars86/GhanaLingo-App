import React from 'react';
import { KENTE_PATTERN_CSS } from '../constants';
import { LucideIcon } from 'lucide-react';

export const KenteStrip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div 
    className={`h-2 w-full ${className}`} 
    style={{ background: KENTE_PATTERN_CSS }} 
  />
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-ghana-green text-white shadow-[0_4px_0_rgb(0,80,40)] active:shadow-none active:translate-y-1 hover:bg-green-800",
    secondary: "bg-ghana-gold text-ghana-black shadow-[0_4px_0_rgb(180,140,0)] active:shadow-none active:translate-y-1 hover:bg-yellow-400",
    outline: "border-2 border-ghana-green text-ghana-green hover:bg-green-50",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-green-100 transition-all bg-white placeholder:text-gray-400 ${props.className || ''}`}
  />
);

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  bg?: string;
}> = ({ children, className = '', onClick, bg = 'bg-white' }) => (
  <div 
    onClick={onClick}
    className={`${bg} rounded-2xl p-4 shadow-md border-b-4 border-gray-200 ${onClick ? 'cursor-pointer hover:border-b-2 hover:translate-y-[2px] transition-all' : ''} ${className}`}
  >
    {children}
  </div>
);

export const NavIcon: React.FC<{
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${isActive ? 'text-ghana-green' : 'text-gray-400'}`}
  >
    <Icon 
      size={24} 
      strokeWidth={isActive ? 3 : 2} 
      className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
    />
    <span className="text-xs font-medium">{label}</span>
  </button>
);