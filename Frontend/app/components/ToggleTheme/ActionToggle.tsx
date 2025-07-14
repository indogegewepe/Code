import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './ActionToggle.module.css';

export default function ActionToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="filled"
        color="#007BFF"
        size="md"
        radius="sm"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'dark' ? (
          <IconSun className={classes.icon} stroke={1.5} />
        ) : (
          <IconMoon className={classes.icon} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
