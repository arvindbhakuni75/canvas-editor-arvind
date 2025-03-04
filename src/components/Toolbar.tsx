import { useCanvas } from "../context/CanvasContext";
import axios from "axios";

const Toolbar = () => {
  const { addElement } = useCanvas();

  // Local randomText for text generation because the OpenAi API is paid
  const randomText = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      text: "You miss 100% of the shots you don’t take.",
      author: "Wayne Gretzky",
    },
  ];

  // Generate text locally
  const generateText = () => {
    const randomIndex = Math.floor(Math.random() * randomText.length);
    const generatedText = `${randomText[randomIndex].text} — ${randomText[randomIndex].author}`;
    addElement("text", generatedText);
  };

  const addImage = async () => {
    try {
      const response = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          headers: {
            Authorization: `Client-ID 3rsqvKrbHXNsEP6MHjSpgKS0Ta_cOR48C7pi7eHdKyM`,
          },
          params: {
            w: 300,
            h: 300,
          },
        }
      );
      const imageUrl = response.data.urls.regular;
      addElement("image", imageUrl);
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    }
  };

  const addFlipComponent = () => {
    addElement("flip", undefined, "Front", "Back");
  };

  return (
    <div className="w-full bg-gray-800 p-4 text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Tools</h2>
      <div className="space-y-4">
        <button
          onClick={generateText}
          className="w-full px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition"
        >
          Generate Text
        </button>
        <button
          onClick={addImage}
          className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
        >
          Generate AI Image
        </button>
        <button
          onClick={addFlipComponent}
          className="w-full px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition"
        >
          Add Flip Card
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
