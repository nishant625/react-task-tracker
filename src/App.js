import Header from "./components/header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import { useState, useEffect } from "react"

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  // Update fetch URL for Docker networking
  const API_URL = process.env.VERCEL_ENV === 'production' 
    ? 'https://react-task-tracker-backend-latest.onrender.com' 
    : 'http://localhost:5000'
 console.log(process.env.VERCEL_ENV);
 
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`)
    const data = await res.json()
    return data
  }

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter((task) => task.id != id))
  } 

  const addTask = async (task) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST', 
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(task)
    })
    
    const data = await res.json()
    setTasks([...tasks, data])
  }

  const toggleReminder = (id) => {
    setTasks(tasks.map((task) => task.id == id ? { ...task, reminder: !task.reminder } : task))
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'no tasks to show'}
    </div>
  ) 
}

export default App;