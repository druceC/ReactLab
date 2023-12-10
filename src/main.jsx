import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
// import App from 'App.jsx'
import './index.css'

const App = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [newMemberInput, setNewMemberInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/clubs');
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClubClick = async (club) => {
    setSelectedClub(club);
  };

  const handleAddMember = async () => {
    try {
      const response = await fetch(`http://localhost:3001/clubs/${selectedClub.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newMemberInput }),
      });
  
      const result = await response.json();
      if (result.success) {
        // Update the state directly to include the new member
        setClubs((prevClubs) => {
          const updatedClubs = prevClubs.map((club) => {
            if (club.id === selectedClub.id) {
              // Clone the club object and update the members array
              return {
                ...club,
                members: [...club.members, newMemberInput],
              };
            }
            return club;
          });
          return updatedClubs;
        });
  
        // Clear the new member input
        setNewMemberInput('');
      } else {
        console.error('Error adding member:', result.error);
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };  

  return (
    <div>
      <h1>Join some clubs!</h1>
      <ul>
        {clubs.map((club) => (
          <li key={club.id} onClick={() => handleClubClick(club)}>
            {club.name}
          </li>
        ))}
      </ul>

      {selectedClub && (
        <div>
          <h2>{selectedClub.name}</h2>
          <p>Members:</p>
          <ul>
            {selectedClub.members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>

          <div>
            <input
              type="text"
              value={newMemberInput}
              onChange={(e) => setNewMemberInput(e.target.value)}
              placeholder="Enter new member name"
            />
            <button onClick={handleAddMember}>Add Member</button>
          </div>
        </div>
      )}
    </div>
  );
};



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <App /> )