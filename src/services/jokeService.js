export const deleteJoke = async (jokeId) => {
    const response = await fetch(`http://localhost:8088/jokes/${jokeId}`, {
        method: "DELETE",
    });

    return response.ok;
};

export const postDeletedJoke = async (joke) => {
    const response = await fetch("http://localhost:8088/deletedJokes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(joke),
    });
    return await response.json();
}

export const postNewJoke = async (jokeText) => {
    // 1. Construct the new joke object
    const newJoke = {
        // The server will usually handle the ide and sometimes "told"
        // However, it's safer to explicitly set the data you control.
        text: jokeText,
        told: false,
    };

    try{
    const response = await fetch("http://localhost:8088/jokes", {
        method: 'POST', // Set the POST method
        headers: {
            'Content-type': 'application/json', // Tell the server the data is JSON
        },
        // Convert the JavaScript object to a JSON string for the body
        body: JSON.stringify(newJoke),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. Parse the response
    const postedJoke = await response.json();
    console.log('Joke posted successfully:', postedJoke);

    // It's typical to update the component's state here to reflect the new joke
    return postedJoke;

    }catch (error) {
        console.error('Failed to post joke:', error);
        // Handle the error (e.g., show an error message to the user)
    }
};

export const updateToldStatus = async (joke) => {
    const response = await fetch(`http://localhost:8088/jokes/${joke.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(joke),
    });

    return await response.json();
}


// Function to handle the GET request (need for initial load)
export const getAllJokes = async () => {
    try {
        const response = await fetch("http://localhost:8088/jokes"); 
        if(!response.ok) {
            throw new Error(`Failed to fetch jokes, status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('API GET Error:', error);
        return []; // Return an empty array on error
    }
} 