'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Order } from '@/types/order';
import { User } from '@/types/user';

export const orderColumns: ColumnDef<Order>[] = [
    {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('id')}</div>
        )
    },
    {
        accessorKey: 'user',
        header: 'User ID',
        cell: ({ row }) => (
            <div className='capitalize'>
                {(row.getValue('user') as User).id}
            </div>
        )
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Status
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className='lowercase'>{row.getValue('status')}</div>
        )
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Created at
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className='lowercase'>
                {new Date(row.getValue('createdAt')).toLocaleString()}
            </div>
        )
    }
];
