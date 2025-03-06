import { useState } from "react";
import axios from "axios";
import { useCanvas } from "../context/CanvasContext";
import toast from "react-hot-toast";

const Toolbar = () => {
  const { addElement } = useCanvas();
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Local randomText for text generation because the OpenAi API is paid
  const randomText = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  ];

  // Generate text locally
  const generateText = () => {
    const randomIndex = Math.floor(Math.random() * randomText.length);
    const generatedText = `${randomText[randomIndex].text} — ${randomText[randomIndex].author}`;
    addElement("text", generatedText);
  };

  const addImage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_UNSPLASH_API_URL}`, {
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
        },
        params: { query }
      });
      if(response.data.results.length > 0) {
      const imageUrl = response.data.results[Math.floor(Math.random() * 10)].urls.regular;
      addElement("image", imageUrl);
      setQuery("");
      } else {
        toast.error("No images found for the given keyword");
      }
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFlipComponent = () => {
    addElement("flip", undefined, "Front", "Back");
  };

  return (
    <div className="w-full bg-gray-800 p-4 text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Tools</h2>
      <div className="space-y-4">
        {/* Styled Input Field */}
        <input
          type="text"
          placeholder="Enter image keyword..."
          className="w-full p-3 text-gray-200 bg-gray-900 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={!query}
          onClick={addImage}
          className="w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          { loading ? "Loading..." : "Generate AI Image"} 
        </button>
        <button
          onClick={generateText}
          className="w-full px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
        >
          Generate Text
        </button>
        <button
          onClick={addFlipComponent}
          className="w-full px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
        >
          Add Flip Card
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
