import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import React from 'react';

// Định nghĩa kiểu Props mở rộng
interface AppIconProps extends Partial<CustomIconComponentProps> {
  icon: React.ComponentType<CustomIconComponentProps | any>;
  size?: number;
  color?: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  icon: IconComponent,
  size = 24,
  color,
  style,
  className,
  ...rest
}) => {
  return (
    <Icon
      component={IconComponent}
      className={className}
      style={{
        fontSize: size,
        color: color,
        ...style,
      }}
      {...rest}
    />
  );
};