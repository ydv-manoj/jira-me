'use client';

import { Card } from '@radix-ui/themes';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid
} from 'recharts';
import React from 'react';

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: 'Open', value: open },
    { label: 'In Progress', value: inProgress },
    { label: 'Closed', value: closed },
  ];

  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis />
          <Tooltip/>
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: 'var(--accent-9)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;