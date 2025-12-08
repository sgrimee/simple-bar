// Styles for /lib/components/data/disk-usage.jsx component
export const diskUsageStyles = /* css */ `
.disk-usage {
  color: var(--foreground);
  background-color: var(--minor);
}
.simple-bar--no-color-in-data .disk-usage {
  color: var(--foreground);
  background-color: var(--minor);
}
.simple-bar--widgets-background-color-as-foreground .disk-usage {
  color: var(--blue);
  background-color: transparent;
}
.disk-usage--critical {
  color: var(--red);
  background-color: var(--minor);
}
.simple-bar--widgets-background-color-as-foreground .disk-usage--critical {
  color: var(--red);
  background-color: transparent;
}
.disk-usage__text {
  font-size: inherit;
  white-space: nowrap;
}
`;
