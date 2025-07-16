import * as TablerIcons from '@tabler/icons-react';

export default function DynamicsIcon({ iconName }: { iconName: string }) {
  const IconComponent = (TablerIcons as any)[iconName];
  if (!IconComponent) return null;
  return <IconComponent size={28} />;
}
