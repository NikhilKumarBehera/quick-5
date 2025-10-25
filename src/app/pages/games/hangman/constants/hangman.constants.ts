// ======================================================================
// ENUM: Hangman Categories
// ======================================================================
export enum Category {
  Science = 'Science',
  Animals = 'Animals',
  Countries = 'Countries',
  Fruits = 'Fruits',
  Sports = 'Sports',
  Colors = 'Colors',
}

// ======================================================================
// INTERFACE
// ======================================================================
export interface HangmanWord {
  word: string;
  hint: string;
  category: Category;
}

// ======================================================================
// WORD DATABASE (Total: 50)
// ======================================================================
export const wordDatabase: HangmanWord[] = [
  // ------------------------------
  // SCIENCE (10)
  // ------------------------------
  { word: 'SUN', hint: 'The star at the center of our solar system', category: Category.Science },
  { word: 'MOON', hint: 'Earth’s natural satellite', category: Category.Science },
  { word: 'STAR', hint: 'Twinkling light in the night sky', category: Category.Science },
  { word: 'ATOM', hint: 'Smallest unit of matter', category: Category.Science },
  { word: 'WATER', hint: 'Covers most of Earth’s surface', category: Category.Science },
  { word: 'EARTH', hint: 'Our home planet', category: Category.Science },
  { word: 'CLOUD', hint: 'White fluffy thing in the sky', category: Category.Science },
  { word: 'LIGHT', hint: 'Makes things visible', category: Category.Science },
  { word: 'RAIN', hint: 'Falls from clouds', category: Category.Science },
  { word: 'PLANT', hint: 'Needs sunlight to grow', category: Category.Science },

  // ------------------------------
  // ANIMALS (10)
  // ------------------------------
  { word: 'CAT', hint: 'Small pet that says meow', category: Category.Animals },
  { word: 'DOG', hint: 'Human’s best friend', category: Category.Animals },
  { word: 'COW', hint: 'Gives us milk', category: Category.Animals },
  { word: 'LION', hint: 'King of the jungle', category: Category.Animals },
  { word: 'TIGER', hint: 'Big striped cat', category: Category.Animals },
  { word: 'HORSE', hint: 'Used for riding', category: Category.Animals },
  { word: 'FISH', hint: 'Lives in water', category: Category.Animals },
  { word: 'BIRD', hint: 'Can fly in the sky', category: Category.Animals },
  { word: 'MONKEY', hint: 'Loves bananas', category: Category.Animals },
  { word: 'SNAKE', hint: 'Long and slithers', category: Category.Animals },

  // ------------------------------
  // COUNTRIES (10)
  // ------------------------------
  { word: 'INDIA', hint: 'Land of the Taj Mahal', category: Category.Countries },
  { word: 'CHINA', hint: 'Country with the Great Wall', category: Category.Countries },
  { word: 'JAPAN', hint: 'Land of the rising sun', category: Category.Countries },
  { word: 'FRANCE', hint: 'Famous for the Eiffel Tower', category: Category.Countries },
  { word: 'EGYPT', hint: 'Home of the pyramids', category: Category.Countries },
  { word: 'BRAZIL', hint: 'Known for football and carnival', category: Category.Countries },
  { word: 'CANADA', hint: 'Very cold country with maple leaves', category: Category.Countries },
  { word: 'ITALY', hint: 'Home of pizza and pasta', category: Category.Countries },
  { word: 'SPAIN', hint: 'Country known for flamenco dance', category: Category.Countries },
  { word: 'AUSTRALIA', hint: 'Country famous for kangaroos', category: Category.Countries },

  // ------------------------------
  // FRUITS (10)
  // ------------------------------
  { word: 'APPLE', hint: 'Keeps the doctor away', category: Category.Fruits },
  { word: 'MANGO', hint: 'King of fruits', category: Category.Fruits },
  { word: 'BANANA', hint: 'Yellow fruit loved by monkeys', category: Category.Fruits },
  { word: 'GRAPE', hint: 'Comes in bunches', category: Category.Fruits },
  { word: 'ORANGE', hint: 'Citrus fruit rich in vitamin C', category: Category.Fruits },
  { word: 'PINEAPPLE', hint: 'Tropical fruit with spiky skin', category: Category.Fruits },
  { word: 'PAPAYA', hint: 'Soft orange tropical fruit', category: Category.Fruits },
  { word: 'CHERRY', hint: 'Small red fruit with a pit', category: Category.Fruits },
  { word: 'WATERMELON', hint: 'Big green fruit with red inside', category: Category.Fruits },
  { word: 'STRAWBERRY', hint: 'Red fruit with tiny seeds on it', category: Category.Fruits },

  // ------------------------------
  // SPORTS (5)
  // ------------------------------
  { word: 'CRICKET', hint: 'Popular bat and ball game', category: Category.Sports },
  { word: 'FOOTBALL', hint: 'Played with a round ball on a field', category: Category.Sports },
  { word: 'TENNIS', hint: 'Played with rackets and a yellow ball', category: Category.Sports },
  { word: 'CHESS', hint: 'Game of kings and strategy', category: Category.Sports },
  { word: 'HOCKEY', hint: 'Played on ice or field with sticks', category: Category.Sports },

  // ------------------------------
  // COLORS (5)
  // ------------------------------
  { word: 'RED', hint: 'Color of an apple', category: Category.Colors },
  { word: 'BLUE', hint: 'Color of the sky', category: Category.Colors },
  { word: 'GREEN', hint: 'Color of grass', category: Category.Colors },
  { word: 'YELLOW', hint: 'Color of the sun', category: Category.Colors },
  { word: 'BLACK', hint: 'Opposite of white', category: Category.Colors },
];
