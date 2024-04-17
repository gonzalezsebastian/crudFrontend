import TareasList from './components/TareasList';

const App = () => {

  return (
    <div className="grid" >
      <h1 className="text-center mt-4 mb-4 text-4xl font-bold">Gestión de Tareas</h1>
      <TareasList />
    </div>
  );
};

export default App;