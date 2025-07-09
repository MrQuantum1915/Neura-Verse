import Card from "@/components/Card";

const playgrounds = [
  {
  title: "Lumina",
  description: "Experience seamless conversations with Lumina, your all-in-one AI companion. Whether you need quick answers, thoughtful recommendations, or just want to chat, Lumina adapts to your needs with natural, intelligent dialogue.",
  link: "/playgrounds/lumina",
  tags: ["Chatbot", "AI", "General Purpose", "Conversational"],
  image: "/playgroundsImages/lumina.jpg"
},
{
  title: "AlgoMind",
  description: "Unlock the power of coding with AlgoMind! This specialized AI assistant offers in-depth programming guidance, clear algorithm explanations, and real-time help for all your computer science challenges—perfect for learners and pros alike.",
  link: "/playgrounds/algomind",
  tags: ["Chatbot", "AI", "Coding", "Algorithms", "Programming"],
  image: "/playgroundsImages/algomind.jpg"
}

];

export default function PlaygroundsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-100 m-10">
      <h1 className="text-4xl font-bold mb-4">AI Playgrounds</h1>
      <p className="text-lg text-blue-100/70 mb-8 max-w-[70%] text-center">
        Welcome to the Playgrounds! Here you can experiment with various AI models, tools, and interactive demos. Select a playground from the menu or check back soon for new features.
      </p>

      <div className=" m-10 grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-4xl">
        {playgrounds.map((playground, index) => (
          <Card
            key={index}
            Title={playground.title}
            Description={playground.description}
            ImageURL={playground.image}
            pageLink={playground.link}
            Tags={playground.tags}
          />
        ))}
      </div>
      <div>

      </div>
    </div>
  );
}
