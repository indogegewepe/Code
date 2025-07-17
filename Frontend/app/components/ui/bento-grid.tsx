import { cn } from '@/lib/utils';
import { IconChevronRight } from '@tabler/icons-react';
import { Button } from '@mantine/core';


export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-6 md:auto-rows-[18rem] md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href = '',
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        'grid-bg h-fit group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2]',
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-white">{title}</div>
        <div className="font-sans text-xs font-normal  text-white">{description}</div>
      </div>
      <Button variant="transparent" color="blue" fullWidth mt="md" radius="md" rightSection={<IconChevronRight size={14} />}>
        Baca Selengkapnya
      </Button>
    </a>
  );
};
