interface DataRowProps {
  label: string;
  value: any;
}

export const DataRow = ({ label, value }: DataRowProps) => (
  <div className="flex py-2 border-b">
    <span className="w-1/3 text-sm text-gray-600">{label}</span>
    <span className="w-2/3 text-sm">{value ?? "N/A"}</span>
  </div>
);