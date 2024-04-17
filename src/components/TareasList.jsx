import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const TareasList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskFields, setEditedTaskFields] = useState({
    nombre: '',
    descripcion: '',
    estado: false,
    prioridad: ''
  });
  const [editedTask, setEditedTask] = useState({
    nombre: '',
    descripcion: '',
    estado: false,
    prioridad: ''
  });
  const [newTask, setNewTask] = useState({
    nombre: '',
    descripcion: '',
    estado: false, // Agregar estado al estado inicial del formulario
    prioridad: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tareas');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Filtrar tareas según el estado seleccionado
    if (filtroEstado === 'Todos') {
      setFilteredTasks(tasks); // Muestra todas las tareas
    } else {
      const filtered = tasks.filter(task => {
        if (filtroEstado === 'Completada') {
          return task.estado; // Filtrar tareas completadas
        } else {
          return !task.estado; // Filtrar tareas pendientes
        }
      });
      setFilteredTasks(filtered); // Filtra las tareas según el estado seleccionado
    }
  }, [tasks, filtroEstado]);

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/tareas/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      console.log('Tarea eliminada');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFilterByEstado = (estado) => {
    setFiltroEstado(estado);
  };

  const handleShowAllTasks = () => {
    setFiltroEstado('Todos');
  };

  const handleEditTask = (id) => {
    setEditingTaskId(id);
    const taskToEdit = tasks.find(task => task._id === id);
    setEditedTaskFields(taskToEdit); // Inicializa los campos editados con los valores actuales de la tarea
  };

  const handleSaveEditedTask = async () => {
    try {
      console.log("Datos a enviar al backend:", editedTaskFields); // Agregar este registro de consola
      await axios.put(`/update-tareas/${editingTaskId}`, { ...editedTask, _id: editingTaskId });
      // Actualizar la lista de tareas después de la edición
      const response = await axios.get('/tareas');
      setTasks(response.data);
      // Restablecer el estado de editingTaskId a null para ocultar los inputs
      setEditingTaskId(null);
      // Limpiar los campos de edición
      setEditedTaskFields({
        nombre: '',
        descripcion: '',
        estado: false,
        prioridad: ''
      });
    } catch (error) {
      console.error('Error saving edited task:', error);
    }
  };

  const handleCreateTask = async () => {
    // Validar si los campos obligatorios están llenos
    if (!newTask.nombre || !newTask.descripcion || !newTask.prioridad) {
      setErrorMessage('Falta llenar los campos obligatorios.');
      return;
    }

    try {
      await axios.post(`/add-tareas`, newTask);
      // Actualizar la lista de tareas después de la creación
      const response = await axios.get('/tareas');
      setTasks(response.data);
      // Limpiar los campos del nuevo formulario
      setNewTask({
        nombre: '',
        descripcion: '',
        estado: false, // Restablecer el estado por defecto
        prioridad: ''
      });
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingTaskId !== null) {
      setEditedTaskFields(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setNewTask(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };  

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditedTaskFields({
      nombre: '',
      descripcion: '',
      estado: false,
      prioridad: ''
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <div className="mb-4 grid">
        <input type="text" name="nombre" value={newTask.nombre} onChange={handleChange} placeholder="Nombre" className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
        <input type="text" name="descripcion" value={newTask.descripcion} onChange={handleChange} placeholder="Descripción" className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
        <select name="estado" value={newTask.estado} onChange={handleChange} className="border border-gray-400 rounded-lg p-2 mb-2 text-black">
          <option value={true}>Completada</option>
          <option value={false}>Pendiente</option>
        </select>
        <input type="text" name="prioridad" value={newTask.prioridad} onChange={handleChange} placeholder="Prioridad" className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
        <button onClick={handleCreateTask} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Crear Tarea</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <div key={task._id} className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              {editingTaskId === task._id ? (
                <div>
                  <input type="text" name="nombre" value={editedTaskFields.nombre} onChange={handleChange} className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
                  <input type="text" name="descripcion" value={editedTaskFields.descripcion} onChange={handleChange} className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
                  <select name="estado" value={editedTaskFields.estado} onChange={handleChange} className="border border-gray-400 rounded-lg p-2 mb-2 text-black">
                    <option value={true}>Completada</option>
                    <option value={false}>Pendiente</option>
                  </select>
                  <input type="text" name="prioridad" value={editedTaskFields.prioridad} onChange={handleChange} className="border border-gray-400 rounded-lg p-2 mb-2 text-black" />
                                    <p className="text-gray-300 text-base">ID: {task._id}</p>
                  <div className='mt-4 flex justify-between'>
                    <button onClick={handleSaveEditedTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar</button>
                    <button onClick={handleCancelEditTask} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-xl mb-2">{task.nombre}</div>
                  <p className="text-gray-300 text-base">Descripción: {task.descripcion}</p>
                  <p className="text-gray-300 text-base">Estado: {task.estado ? 'Completada' : 'Pendiente'}</p>
                  <p className="text-gray-300 text-base">Prioridad: {task.prioridad}</p>
                  <p className="text-gray-300 text-base">ID: {task._id}</p>
                  <div className="mt-4 flex justify-between">
                    <button onClick={() => handleEditTask(task._id)} className="transition-all bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar</button>
                    <button onClick={() => handleDeleteTask(task._id)} className="transition-all bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Borrar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-4 my-4">
        <button onClick={() => handleFilterByEstado('Completada')} className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Completadas</button>
        <button onClick={() => handleFilterByEstado('Pendiente')} className="mr-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Pendientes</button>
        <button onClick={handleShowAllTasks} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Mostrar Todas</button>
      </div>
    </div>
  );
};

export default TareasList;