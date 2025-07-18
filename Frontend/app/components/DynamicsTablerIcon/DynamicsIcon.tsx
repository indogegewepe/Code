import * as TablerIcons from '@tabler/icons-react';
import React from 'react';

type DynamicsIconProps = {
  iconName: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
};

export default function DynamicsIcon({
  iconName,
  size,
  style,
  className,
}: DynamicsIconProps) {
  const IconComponent = (TablerIcons as any)[iconName];
  if (!IconComponent) return null;
  return <IconComponent size={size} style={style} className={className} />;
}
