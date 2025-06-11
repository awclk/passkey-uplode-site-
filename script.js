 document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('update-keys-form').addEventListener('submit', async function(event) {
   event.preventDefault();

   const newKey = document.getElementById('new-key').value;
   const messageDiv = document.getElementById('message');

   // GitHub API endpoint
   const apiUrl = 'https://api.github.com/repos/{username}/{repo}/contents/{path}'; //ඔයාගේ විස්තර මෙතනට දෙන්න
   const filePath = 'trading/passkey.json'; // path එක දෙන්න
   const repo = '{databse}'; // repository name එක දෙන්න
   const username = '{awclk}'; // username එක දෙන්න
   const token = '{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}'; // ඔයාගේ token එක දෙන්න

   // Fetch the current content
   const getUrl = apiUrl.replace('{username}', username).replace('{repo}', repo).replace('{path}', filePath);

   try {
    const getResponse = await fetch(getUrl, {
     headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
     }
    });

    if (!getResponse.ok) {
     throw new Error(`Failed to fetch current content: ${getResponse.status}`);
    }

    const getContent = await getResponse.json();
    const sha = getContent.sha; // Get the SHA of the current file
    const currentContent = atob(getContent.content); // Base64 decode
    const currentKeys = JSON.parse(currentContent); // Parse JSON

    // Add the new key to the array
    currentKeys.push(newKey);

    // New content
    const updatedKeys = JSON.stringify(currentKeys); // Convert to JSON string
    const content = btoa(updatedKeys); // Base64 encode

    // Update the file
    const updateUrl = apiUrl.replace('{username}', username).replace('{repo}', repo).replace('{path}', filePath);
    const updateResponse = await fetch(updateUrl, {
     method: 'PUT',
     headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
     },
     body: JSON.stringify({
      message: 'Update keys via website',
      content: content,
      sha: sha // Use the SHA from the GET request
     })
    });

    if (!updateResponse.ok) {
     throw new Error(`Failed to update keys: ${updateResponse.status}`);
    }

    messageDiv.textContent = 'Keys updated successfully!';
   } catch (error) {
    console.error('Error:', error);
    messageDiv.textContent = `Failed to update keys: ${error.message}`;
   }
  });
 });
 
