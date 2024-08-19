import React, { ReactNode } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';


interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    percentage: string | number;
    increase: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, percentage, increase }) => {

    return (
        <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-50 hover:shadow-lg hover:border hover:border-gray-100 transition-all duration-300">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium dark:text-gray-400">
                    {icon}
                    <span className=' text-gray-800'>{title}</span>
                </div>
                <div className="text-3xl dark:text-gray-500">{value}</div>
                <div className={`flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium ${increase ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{percentage}% {increase ? 'increase' : 'decrease'}</span>
                    {increase ? <FaArrowUp className="w-4 h-4" /> : <FaArrowDown className="w-4 h-4" />}
                </div>
            </div>
        </div>
    );
};

export default StatCard;