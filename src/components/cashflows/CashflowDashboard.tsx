import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CashflowData {
  period: number;
  scheduledPrincipal: number;
  scheduledInterest: number;
  prepayments: number;
  losses: number;
  recoveries: number;
}

interface ScenarioResult {
  name: string;
  cashflows: CashflowData[];
  metrics: {
    waf: number;
    modifiedDuration: number;
    yield: number;
  };
}

interface CashflowDashboardProps {
  scenarios?: ScenarioResult[];
  onScenarioSelect?: (scenario: string) => void;
  onPeriodSelect?: (period: number) => void;
}

const CashflowDashboard = ({
  scenarios = [],
  onScenarioSelect,
  onPeriodSelect
}: CashflowDashboardProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'principal' | 'interest' | 'losses'>('principal');
  const [showCumulative, setShowCumulative] = useState(false);

  const chartData = useMemo(() => {
    if (!scenarios.length) return [];

    return scenarios.map(scenario => {
      if (!scenario?.cashflows) return [];

      let cumulative = 0;
      return scenario.cashflows.map(cf => {
        if (!cf) return null;

        const value = selectedMetric === 'principal' ? 
          (cf.scheduledPrincipal || 0) + (cf.prepayments || 0) :
          selectedMetric === 'interest' ? 
            (cf.scheduledInterest || 0) :
            (cf.losses || 0);

        cumulative += value;
        return {
          period: cf.period,
          [scenario.name]: showCumulative ? cumulative : value
        };
      }).filter(Boolean);
    }).reduce((merged, current) => {
      current.forEach((point, i) => {
        if (point) {
          merged[i] = { ...merged[i], ...point };
        }
      });
      return merged;
    }, []);
  }, [scenarios, selectedMetric, showCumulative]);

  const metrics = useMemo(() => {
    if (!scenarios.length) return [];

    return scenarios.map(s => {
      if (!s?.metrics) return null;
      
      return {
        name: s.name,
        waf: s.metrics.waf?.toFixed(2) || '0.00',
        duration: s.metrics.modifiedDuration?.toFixed(2) || '0.00',
        yield: s.metrics.yield?.toFixed(2) || '0.00'
      };
    }).filter(Boolean);
  }, [scenarios]);

  const handleScenarioClick = useCallback((scenario: string) => {
    onScenarioSelect?.(scenario);
  }, [onScenarioSelect]);

  if (!scenarios.length) {
    return (
      <div className="w-full p-4">
        <Alert>
          <AlertDescription>
            No scenario data available. Please select or generate scenarios.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="metric-select">Metric</Label>
          <Select
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value as any)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="principal">Principal</SelectItem>
              <SelectItem value="interest">Interest</SelectItem>
              <SelectItem value="losses">Losses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cumulative"
            checked={showCumulative}
            onCheckedChange={(checked) => setShowCumulative(checked as boolean)}
          />
          <Label htmlFor="cumulative">
            Show Cumulative
          </Label>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                label={{ value: 'Period', position: 'bottom' }}
              />
              <YAxis label={{ value: selectedMetric, angle: -90, position: 'left' }} />
              <Tooltip />
              <Legend />
              {scenarios.map(s => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={getScenarioColor(s.name)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  onClick={() => handleScenarioClick(s.name)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Metrics Table */}
      {metrics.length > 0 && (
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scenario</TableHead>
                <TableHead>WAF</TableHead>
                <TableHead>Modified Duration</TableHead>
                <TableHead>Yield</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((m) => (
                <TableRow 
                  key={m.name}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    "data-[state=selected]:bg-muted"
                  )}
                  onClick={() => handleScenarioClick(m.name)}
                >
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.waf}</TableCell>
                  <TableCell>{m.duration}</TableCell>
                  <TableCell>{m.yield}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Alerts */}
      {scenarios.some(s => s.metrics?.waf < 2) && (
        <Alert>
          <AlertDescription>
            Warning: Some scenarios have a WAF less than 2 years, indicating potential rapid prepayment risk.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Helper function to assign consistent colors to scenarios
const getScenarioColor = (name: string): string => {
  const colors: { [key: string]: string } = {
    'Base': '#2563eb',
    'High Prepay': '#dc2626', 
    'High Default': '#ea580c',
    'High Severity': '#d97706',
    'Combined Stress': '#7c3aed',
    'Fast Recovery': '#059669',
    'Slow Recovery': '#0891b2'
  };
  return colors[name] || '#6b7280';
};

export default CashflowDashboard;