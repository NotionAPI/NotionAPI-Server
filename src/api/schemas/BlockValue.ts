interface BlockValue {
  id: string;
  type: string;
  properties?: Record<string, any>;
  format: Record<string, any>;
  content: any[];
}
