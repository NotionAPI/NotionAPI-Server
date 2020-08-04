interface FilterQuery {
  property: string;
  filter: { operator: string; value: { type: string; value: any } };
}
