import Card from "@/components/Card";

const playgrounds = [
  {
    title: "LUMINA",
    description: "A multimodal LLM chat with unified AI providers and persistent history. Features NEURA FLOW - a version-controlled DAG engine for non-linear reasoning with Git-like branching and canvas flow management.",
    link: "/playgrounds/lumina",
    tags: ["General Purpose", "Conversational"],
    image: "/playgroundsImages/lumina.png"
  }, 
  {
    title: "Neura Glyph",
    description: "An interactive playground hosting custom-trained digit recognition models. Explore the intricacies of machine learning vision systems and test their accuracy in real-time.",
    link: "/playgrounds/neura-glyph",
    tags: ["Neural Networks", "CNN", "Image Recognition"],
    image: "/playgroundsImages/neura-glyph.png"
  }
];

export default function PlaygroundsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-100 my-20 px-4">
      <h1 className="text-5xl text- md:text-7xl font-black mb-8 uppercase tracking-widest text-center border-b-2 border-white/20 pb-6 w-full max-w-4xl">PLAYGROUNDS</h1>
      <p className="text-base md:text-lg text-white/70 mb-12 max-w-[90%] md:max-w-[70%] text-center tracking-widest leading-relaxed font-sans">
        Dive into our interactive playgrounds. Explore the modules related to AI/ML. Come back often to see new modules and updates! If you have any suggestions for new playgrounds or improvements, please reach out to us on GitHub!  
      </p>

      <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-4xl px-4">
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
