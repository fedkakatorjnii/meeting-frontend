import React from 'react';

type AppProps = {
  name: string;
};

const App: React.FC<AppProps> = (props) => {
  const { name } = props;

  return (
    <div>
      <p>{`Hello, ${name}`}</p>
    </div>
  );
};

export { App };
