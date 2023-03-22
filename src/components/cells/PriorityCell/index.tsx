import { Chip } from '@mui/material';

type PriorityCellProps = {
  value: WantedCardPriority;
};

const PriorityCell: React.FC<PriorityCellProps> = ({ value }) => {
  const getPriorityMapLabel = (value: WantedCardPriority) => {
    const priorityMapLabel: Record<
      WantedCardPriority | 'default',
      {
        label: string;
        color:
          | 'default'
          | 'primary'
          | 'secondary'
          | 'error'
          | 'info'
          | 'success'
          | 'warning'
          | undefined;
      }
    > = {
      high: { label: 'Alto', color: 'primary' },
      medium: { label: 'Médio', color: 'secondary' },
      low: { label: 'Baixo', color: 'warning' },
      default: { label: 'Não definido', color: 'default' },
    };

    return priorityMapLabel[value] || priorityMapLabel['default'];
  };

  const { label, color } = getPriorityMapLabel(value);

  return <Chip label={label} color={color} />;
};

export default PriorityCell;

