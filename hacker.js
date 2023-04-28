// Define a string of uppercase alphabets
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Add a 'mouseover' event listener to the h1 element
document.querySelector("h1").onmouseover = (event) => {
  // Initialize a variable to keep track of how many times we have iterated
  let iterations = 0;

  // Create an interval that runs a function every 30 milliseconds
  const interval = setInterval(() => {
    // Change the text of the h1 element
    event.target.innerText = event.target.innerText
      // Split the text into an array of characters
      .split("")
      // Transform each character in the array
      .map((letter, index) => {
        // If the index of the character is less than the current number of iterations,
        // replace it with the corresponding character from the original text
        if (index < iterations) {
          return event.target.dataset.value[index];
        }
        // Otherwise, replace it with a random letter
        return letters[Math.floor(Math.random() * 26)];
      })
      // Join the transformed characters back into a string
      .join("");

    // If we've iterated over all characters in the original text, clear the interval
    if (iterations >= event.target.dataset.value.length)
      clearInterval(interval);

    // Increment the number of iterations by 1/3
    iterations += 1 / 5;
  }, 30); // Interval function ends here
}; // Event listener function ends here
