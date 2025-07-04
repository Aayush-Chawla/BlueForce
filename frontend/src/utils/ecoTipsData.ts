import { EcoTip, FAQ, MCQQuestion } from '../types';

export const ecoTips: EcoTip[] = [
  {
    id: '1',
    title: 'Use Reusable Water Bottles',
    content: 'Replace single-use plastic bottles with reusable ones. A single reusable bottle can eliminate the need for hundreds of plastic bottles per year, significantly reducing ocean plastic pollution.',
    category: 'waste-reduction',
    difficulty: 'easy',
    impact: 'high',
    icon: 'Droplets'
  },
  {
    id: '2',
    title: 'Choose Reef-Safe Sunscreen',
    content: 'Use mineral-based sunscreens with zinc oxide or titanium dioxide. Chemical sunscreens containing oxybenzone and octinoxate can harm coral reefs and marine life.',
    category: 'ocean-protection',
    difficulty: 'easy',
    impact: 'medium',
    icon: 'Sun'
  },
  {
    id: '3',
    title: 'Reduce Microplastic Pollution',
    content: 'Wash synthetic clothing less frequently and use a microfiber-catching laundry bag. Synthetic fabrics release microplastics that end up in our oceans.',
    category: 'waste-reduction',
    difficulty: 'medium',
    impact: 'high',
    icon: 'Shirt'
  },
  {
    id: '4',
    title: 'Support Sustainable Seafood',
    content: 'Choose seafood that\'s caught or farmed sustainably. Look for certifications like MSC (Marine Stewardship Council) to help protect fish populations and marine ecosystems.',
    category: 'ocean-protection',
    difficulty: 'medium',
    impact: 'high',
    icon: 'Fish'
  },
  {
    id: '5',
    title: 'Use LED Light Bulbs',
    content: 'Replace incandescent bulbs with LED bulbs. They use 75% less energy and last 25 times longer, reducing both energy consumption and waste.',
    category: 'energy-saving',
    difficulty: 'easy',
    impact: 'medium',
    icon: 'Lightbulb'
  },
  {
    id: '6',
    title: 'Compost Organic Waste',
    content: 'Start composting food scraps and yard waste. Composting reduces methane emissions from landfills and creates nutrient-rich soil for plants.',
    category: 'waste-reduction',
    difficulty: 'medium',
    impact: 'medium',
    icon: 'Leaf'
  },
  {
    id: '7',
    title: 'Use Public Transportation',
    content: 'Choose public transport, cycling, or walking over driving when possible. Transportation accounts for about 14% of global greenhouse gas emissions.',
    category: 'sustainable-living',
    difficulty: 'medium',
    impact: 'high',
    icon: 'Bus'
  },
  {
    id: '8',
    title: 'Proper Battery Recycling',
    content: 'Never throw batteries in regular trash. Take them to designated recycling centers to prevent toxic chemicals from leaching into soil and water.',
    category: 'recycling',
    difficulty: 'easy',
    impact: 'medium',
    icon: 'Battery'
  },
  {
    id: '9',
    title: 'Reduce Phantom Energy Load',
    content: 'Unplug electronics when not in use or use smart power strips. Many devices consume energy even when turned off, accounting for 5-10% of home energy use.',
    category: 'energy-saving',
    difficulty: 'easy',
    impact: 'medium',
    icon: 'Zap'
  },
  {
    id: '10',
    title: 'Choose Bamboo Products',
    content: 'Replace plastic items with bamboo alternatives. Bamboo grows rapidly, requires no pesticides, and is biodegradable, making it an excellent eco-friendly material.',
    category: 'sustainable-living',
    difficulty: 'easy',
    impact: 'medium',
    icon: 'TreePine'
  }
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How long does plastic take to decompose in the ocean?',
    answer: 'Plastic can take 450-1000 years to decompose in the ocean. Some plastics may never fully decompose, instead breaking down into microplastics that persist in the marine environment indefinitely.',
    category: 'Ocean Protection'
  },
  {
    id: '2',
    question: 'What is the Great Pacific Garbage Patch?',
    answer: 'The Great Pacific Garbage Patch is a collection of marine debris concentrated by ocean currents in the North Pacific Ocean. It\'s estimated to be twice the size of Texas and contains at least 80,000 metric tons of plastic.',
    category: 'Ocean Protection'
  },
  {
    id: '3',
    question: 'How can I reduce my carbon footprint at home?',
    answer: 'You can reduce your carbon footprint by using energy-efficient appliances, improving home insulation, using renewable energy sources, reducing water consumption, and choosing sustainable transportation options.',
    category: 'Sustainable Living'
  },
  {
    id: '4',
    question: 'What items can and cannot be recycled?',
    answer: 'Generally recyclable: paper, cardboard, glass bottles, aluminum cans, plastic bottles (#1-2). Not recyclable: plastic bags, styrofoam, broken glass, electronics, and contaminated materials. Check local guidelines as they vary.',
    category: 'Recycling'
  },
  {
    id: '5',
    question: 'How does beach pollution affect marine life?',
    answer: 'Beach pollution harms marine life through ingestion of plastic debris, entanglement in fishing nets and plastic rings, habitat destruction, and chemical contamination that affects reproduction and health.',
    category: 'Ocean Protection'
  },
  {
    id: '6',
    question: 'What are microplastics and why are they dangerous?',
    answer: 'Microplastics are plastic particles smaller than 5mm. They\'re dangerous because they can be ingested by marine life, enter the food chain, and potentially affect human health. They also absorb toxic chemicals from the environment.',
    category: 'Waste Reduction'
  },
  {
    id: '7',
    question: 'How can I make my daily routine more eco-friendly?',
    answer: 'Use reusable bags and water bottles, choose public transport or cycling, buy local and seasonal produce, reduce meat consumption, use eco-friendly cleaning products, and minimize single-use items.',
    category: 'Sustainable Living'
  },
  {
    id: '8',
    question: 'What is the impact of fast fashion on the environment?',
    answer: 'Fast fashion contributes to water pollution, excessive waste, high carbon emissions, and poor working conditions. The industry is responsible for 10% of global carbon emissions and 20% of global wastewater.',
    category: 'Sustainable Living'
  }
];

export const mcqQuestions: MCQQuestion[] = [
  {
    id: '1',
    question: 'How many plastic bottles are sold worldwide every minute?',
    options: ['500,000', '1 million', '2 million', '5 million'],
    correctAnswer: 1,
    explanation: 'Approximately 1 million plastic bottles are sold every minute globally, highlighting the massive scale of plastic consumption.',
    category: 'Waste Reduction',
    points: 10
  },
  {
    id: '2',
    question: 'What percentage of the ocean has been explored by humans?',
    options: ['5%', '20%', '50%', '80%'],
    correctAnswer: 0,
    explanation: 'Less than 5% of the ocean has been explored, making it one of the least understood environments on Earth.',
    category: 'Ocean Protection',
    points: 10
  },
  {
    id: '3',
    question: 'Which material takes the longest to decompose in a landfill?',
    options: ['Aluminum can', 'Plastic bottle', 'Glass bottle', 'Paper'],
    correctAnswer: 2,
    explanation: 'Glass bottles can take up to 1 million years to decompose, making them the longest-lasting waste in landfills.',
    category: 'Recycling',
    points: 15
  },
  {
    id: '4',
    question: 'What is the most effective way to reduce your carbon footprint?',
    options: ['Recycling more', 'Using LED bulbs', 'Reducing meat consumption', 'Taking shorter showers'],
    correctAnswer: 2,
    explanation: 'Reducing meat consumption, especially beef, can significantly reduce your carbon footprint as livestock farming produces substantial greenhouse gases.',
    category: 'Sustainable Living',
    points: 15
  },
  {
    id: '5',
    question: 'How much of the world\'s oxygen is produced by the ocean?',
    options: ['20%', '50%', '70%', '90%'],
    correctAnswer: 2,
    explanation: 'The ocean produces approximately 70% of the world\'s oxygen, primarily through phytoplankton photosynthesis.',
    category: 'Ocean Protection',
    points: 20
  },
  {
    id: '6',
    question: 'What is the average lifespan of a reusable water bottle?',
    options: ['1 year', '3 years', '5 years', '10+ years'],
    correctAnswer: 3,
    explanation: 'A quality reusable water bottle can last 10+ years with proper care, replacing thousands of single-use bottles.',
    category: 'Waste Reduction',
    points: 10
  },
  {
    id: '7',
    question: 'Which renewable energy source is the fastest growing globally?',
    options: ['Wind', 'Solar', 'Hydroelectric', 'Geothermal'],
    correctAnswer: 1,
    explanation: 'Solar energy is the fastest-growing renewable energy source, with costs decreasing rapidly and efficiency improving.',
    category: 'Energy Saving',
    points: 15
  },
  {
    id: '8',
    question: 'What percentage of plastic waste is actually recycled globally?',
    options: ['9%', '25%', '50%', '75%'],
    correctAnswer: 0,
    explanation: 'Only about 9% of plastic waste is actually recycled globally, with most ending up in landfills or the environment.',
    category: 'Recycling',
    points: 20
  }
];

export const getDailyTip = (): EcoTip => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const tipIndex = dayOfYear % ecoTips.length;
  return ecoTips[tipIndex];
};