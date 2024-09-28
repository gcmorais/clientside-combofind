import React from 'react';

const DotSelector = ({ onSelect }) => {
  const [selected, setSelected] = React.useState('medium'); // valor padrão

  const options = ['low', 'medium', 'high'];

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option); // Atualiza o budget no componente pai
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => handleSelect(option)}
          style={{
            backgroundColor: selected === option ? 'orange' : 'gray',
            padding: '10px',
            borderRadius: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          className="text-sm text-center font-[family-name:var(--font-geist-mono)]"
        >
          {option.toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export {DotSelector};
