// Function to generate a random username using AI
export async function generateUsername(): Promise<string> {
  try {
    // For demo purposes, we'll use a simple random generation
    // In a production app, you could use the AI SDK to generate more creative names
    const adjectives = [
      "Bouncy",
      "Quiet",
      "Sleepy",
      "Brave",
      "Swift",
      "Clever",
      "Witty",
      "Fluffy",
      "Gentle",
      "Wild",
      "Calm",
      "Eager",
      "Fancy",
      "Happy",
      "Jolly",
      "Lucky",
    ]

    const animals = [
      "Fox",
      "Owl",
      "Bear",
      "Wolf",
      "Deer",
      "Lion",
      "Tiger",
      "Panda",
      "Eagle",
      "Hawk",
      "Duck",
      "Swan",
      "Frog",
      "Seal",
      "Whale",
      "Shark",
    ]

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)]

    return `${randomAdjective}${randomAnimal}`

    // Uncomment to use AI for username generation
    /*
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: "Generate a random, friendly username combining an adjective and an animal (e.g., BouncyFox, QuietOwl). Just return the username, nothing else.",
      maxTokens: 10,
    });
    
    return text.trim();
    */
  } catch (error) {
    console.error("Error generating username:", error)
    return "AnonymousUser"
  }
}

