import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";
import { Recipe } from "../types/types";
import chef from "../assets/chef.png";

type Message = { role: "system" | "user" | "assistant"; content: string };

interface ChatboxProps {
  recipe: Recipe;
}

export default function Chatbox({ recipe }: ChatboxProps) {
  const recipeContent = [
    `Title: ${recipe.title}`,
    `Description: ${recipe.description}`,
    `Cuisine: ${recipe.cuisine_type}`,
    `Difficulty: ${recipe.difficulty_level}`,
    `Prep time: ${recipe.prep_time} minutes`,
    `Cook time: ${recipe.cook_time} minutes`,
    `Ingredients:\n- ${recipe.ingredients.join("\n- ")}`,
    `Instructions:\n${recipe.instructions}`,
  ].join("\n\n");

  const initialMessages: Message[] = [
    {
      role: "system",
      content:
        `You are Gusteau, a helpful ${recipe.cuisine_type} chef. ` +
        `Answer *only* from the recipe below—do not hallucinate or refer to anything else:\n\n` +
        recipeContent,
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset chat when recipe changes
  useEffect(() => {
    setMessages(initialMessages);
    setInput("");
    setError(null);
  }, [recipe]);

  // Auto‑scroll on new messages
  useEffect(() => {
    const c = containerRef.current;
    if (c) {
      c.scrollTop = c.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount and whenever loading finishes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    sendMessage();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setError(null);
    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!res.ok) throw new Error(await res.text());

      const assistantMsg = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMsg.content },
      ]);
    } catch (err: any) {
      console.error(err);
      setError("Gusteau had a problem answering that.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded px-4 pb-4 bg-[#c6b5a5]">
      <div className="flex items-center mb-0">
        <img
          src={chef}
          alt="Chef Gusteau"
          className="w-16 h-18 mr-2 object-contain"
        />
        <p className="text-black">Gusteau is here to help you with this recipe!</p>
      </div>

      {/* Chat messages */}
      <div
        ref={containerRef}
        className="h-64 overflow-y-auto border rounded p-2 bg-[#fdf5e6] text-sm"
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, i) => (
            <div key={i} className="mb-2">
              <strong>{msg.role === "user" ? "You" : "Gusteau"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        {loading && (
          <div className="text-gray-500 italic">Gusteau is thinking...</div>
        )}
      </div>

      {error && <div className="text-red-600 text-sm italic mt-2">{error}</div>}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <div className="border rounded bg-[#fdf5e6] flex items-center w-full px-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Gusteau about this recipe…"
            value={input}
            onChange={handleInputChange}
            className="flex-1 bg-transparent focus:outline-none p-2 text-sm"
          />
          <button
            type="submit"
            className="ml-1 px-2 py-0.5 text-xs bg-[#e0d1a8] text-black rounded mb-1 mt-1"
            disabled={loading}
          >
            {loading ? "■": "↑"}
          </button>
        </div>
      </form>
    </div>
  );
}
