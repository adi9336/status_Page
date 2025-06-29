const fetch = require('node-fetch');

async function addUser(userData) {
  try {
    const response = await fetch('http://localhost:3000/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ User added successfully:', result);
      return result;
    } else {
      console.error('❌ Failed to add user:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  }
}

// Example usage
const newUser = {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'MEMBER', // or 'ADMIN', 'MANAGER', 'VIEWER'
  organizationId: 'org_2z6AucumjhZE4b008K1hvAresjG' // Replace with your org ID
};

console.log('Adding user:', newUser.email);
addUser(newUser); 