
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>My React Application</h1>

      <h2>Users List</h2>

      {users.map(user => (
        <p key={user.id}>
          {user.id}. {user.name}
        </p>
      ))}
    </div>
  );
}

export default App;
