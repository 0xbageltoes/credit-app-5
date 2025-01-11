interface DataRowProps {
  label: string;
  value: any;
  noBorder?: boolean;
}

export const DataRow = ({ label, value, noBorder = false }: DataRowProps) => (
  <div className={`flex py-1 ${!noBorder ? 'border-b' : ''}`}>
    <span className="w-1/3 text-xs text-gray-600">{label}</span>
    <span className="w-2/3 text-xs">{value ?? "N/A"}</span>
  </div>
);