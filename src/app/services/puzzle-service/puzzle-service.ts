import { Injectable } from '@angular/core';

export interface Puzzle {
  id: string;
  type: 'Math' | 'Memory' | 'Logic' | 'Riddle' | 'Pattern';
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PuzzleService {
  // Define the Puzzle interface (assuming this is already defined in your project)
  private puzzleBank: Puzzle[] = [
    // ======================================================================
    // MATH PUZZLES (Total: 18)
    // ======================================================================
    {
      id: 'math_001',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question: 'What comes next in the sequence?\n8, 15, 28, 53, ?',
      options: ['98', '102', '104', '106'],
      correctAnswer: 1,
      explanation:
        'The pattern is $(n \times 2) - \text{incrementing value}$. $8 \times 2 - 1 = 15$, $15 \times 2 - 2 = 28$, $28 \times 2 - 3 = 53$, $53 \times 2 - 4 = 102$.',
    },
    {
      id: 'math_002',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question:
        'If 5 machines make 5 widgets in 5 minutes, how long does it take 100 machines to make 100 widgets?',
      options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
      correctAnswer: 0,
      explanation:
        'Each machine makes 1 widget in 5 minutes. The rate is constant.',
    },
    {
      id: 'math_003',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question: '25 + 17 × 2 = ?',
      options: ['84', '59', '42', '34'],
      correctAnswer: 1,
      explanation:
        'Follow order of operations: $17 \times 2 = 34$, then $25 + 34 = 59$',
    },
    {
      id: 'math_004',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question: 'A farmer has 19 sheep. All but 9 die. How many are left?',
      options: ['10', '9', '0', '19'],
      correctAnswer: 1,
      explanation: '"All but 9 die" means 9 survived.',
    },
    {
      id: 'math_005',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question: 'Solve for X: $3x - 5 = 16$',
      options: ['5', '7', '8', '11'],
      correctAnswer: 1,
      explanation: '$3x = 21 implies x = 7$',
    },
    {
      id: 'math_006',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question:
        'If you travel 60 miles at 30 mph, and then return at 60 mph, what is your average speed for the round trip?',
      options: ['40 mph', '45 mph', '50 mph', '48 mph'],
      correctAnswer: 0,
      explanation:
        'Total distance is 120 miles. Total time is $2 \text{ hours} + 1 \text{ hour} = 3 \text{ hours}$. Average speed is $120/3 = 40 \text{ mph}$.',
    },
    {
      id: 'math_007',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question: 'What is $\frac{3}{4}$ of 120?',
      options: ['80', '90', '100', '110'],
      correctAnswer: 1,
      explanation: '$\frac{3}{4} \times 120 = 90$',
    },
    {
      id: 'math_008',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question:
        'A clock strikes 6 in 5 seconds. How long does it take to strike 12?',
      options: ['11 seconds', '10 seconds', '12 seconds', '22 seconds'],
      correctAnswer: 0,
      explanation:
        '6 strikes mean 5 intervals. $5 \text{ seconds}/5 \text{ intervals} = 1 \text{ second/interval}$. 12 strikes mean 11 intervals. $11 \times 1 = 11 \text{ seconds}$.',
    },
    {
      id: 'math_009',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question:
        'If a number is doubled and then 17 is added, the result is 73. What is the number?',
      options: ['24', '28', '32', '36'],
      correctAnswer: 1,
      explanation: '$2x + 17 = 73 implies 2x = 56 implies x = 28$.',
    },
    {
      id: 'math_010',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question: 'Sequence: 1, 4, 7, 10, ?',
      options: ['12', '11', '14', '13'],
      correctAnswer: 3,
      explanation: 'The pattern is adding 3 each time. $10 + 3 = 13$.',
    },
    {
      id: 'math_011',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question: 'If today is Tuesday, what day will it be 100 days from now?',
      options: ['Thursday', 'Friday', 'Wednesday', 'Monday'],
      correctAnswer: 0,
      explanation:
        '$100 div 7 = 14$ remainder 2. Two days after Tuesday is Thursday.',
    },
    {
      id: 'math_012',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question: 'What is $15% \text{ of } 200$?',
      options: ['30', '45', '15', '20'],
      correctAnswer: 0,
      explanation: '$0.15 \times 200 = 30$.',
    },
    {
      id: 'math_013',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question: 'Sequence: 2, 6, 18, 54, ?',
      options: ['108', '162', '180', '216'],
      correctAnswer: 1,
      explanation:
        'The pattern is multiplying by 3 each time. $54 \times 3 = 162$',
    },
    {
      id: 'math_014',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question:
        'A suit costs $200 after a 20% discount. What was the original price?',
      options: ['$220', '$240', '$250', '$280'],
      correctAnswer: 2,
      explanation:
        '$200 \text{ is } 80% \text{ of the original price}$. $200 / 0.80 = 250$',
    },
    {
      id: 'math_015',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question: 'What is the sum of all integers between 1 and 20, inclusive?',
      options: ['190', '210', '200', '220'],
      correctAnswer: 1,
      explanation:
        'The sum of an arithmetic series is $n(n+1)/2$. $20 \times 21 / 2 = 210$',
    },
    {
      id: 'math_016',
      type: 'Math',
      icon: '🧮',
      difficulty: 'easy',
      question:
        'If you have $2.5 \text{ dozens of eggs}$, how many eggs do you have?',
      options: ['24', '30', '36', '40'],
      correctAnswer: 1,
      explanation: '$2.5 \times 12 = 30 \text{ eggs}$.',
    },
    {
      id: 'math_017',
      type: 'Math',
      icon: '🧮',
      difficulty: 'medium',
      question: 'Simplify: $5 \times 8 - 12 div 4$',
      options: ['28', '37', '38', '40'],
      correctAnswer: 1,
      explanation: 'Follow order of operations: $40 - 3 = 37$',
    },
    {
      id: 'math_018',
      type: 'Math',
      icon: '🧮',
      difficulty: 'hard',
      question:
        'The product of two consecutive even integers is 48. What is the larger integer?',
      options: ['6', '8', '10', '12'],
      correctAnswer: 1,
      explanation: 'The two integers are 6 and 8. The larger is 8.',
    },

    // ======================================================================
    // MEMORY PUZZLES (Total: 18)
    // ======================================================================
    {
      id: 'memory_001',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize this sequence:\n7 - 3 - 9 - 1 - 5\n\nWhat was the 3rd number?',
      options: ['3', '9', '1', '5'],
      correctAnswer: 1,
    },
    {
      id: 'memory_002',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question:
        'Remember these words:\nAPPLE, TIGER, CLOUD, PIANO\n\nWhich word came second?',
      options: ['APPLE', 'TIGER', 'CLOUD', 'PIANO'],
      correctAnswer: 1,
    },
    {
      id: 'memory_003',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Study this pattern:\n🔵 🔴 🟢 🟡 🔵\n\nWhich color appeared twice?',
      options: ['Blue', 'Red', 'Green', 'Yellow'],
      correctAnswer: 0,
    },
    {
      id: 'memory_004',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize this number:\n482019\n\nWhat is the sum of the first and last digit?',
      options: ['11', '13', '10', '12'],
      correctAnswer: 1,
      explanation: '$4 + 9 = 13$',
    },
    {
      id: 'memory_005',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question:
        'Remember this list:\nBook, Chair, Lamp, Desk\n\nWhich item was in the third position?',
      options: ['Book', 'Chair', 'Lamp', 'Desk'],
      correctAnswer: 2,
    },
    {
      id: 'memory_006',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Memorize this sequence of letters:\nR - H - P - T - J\n\nWhat letter was immediately after H?',
      options: ['R', 'P', 'T', 'J'],
      correctAnswer: 1,
    },
    {
      id: 'memory_007',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize this sequence: 4 - 8 - 2 - 6. What was the *last* number?',
      options: ['4', '8', '2', '6'],
      correctAnswer: 3,
    },
    {
      id: 'memory_008',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question:
        'Remember these shapes: Square, Circle, Triangle, Star. Which shape came *first*?',
      options: ['Square', 'Circle', 'Triangle', 'Star'],
      correctAnswer: 0,
    },
    {
      id: 'memory_009',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Study this list: Fork, Spoon, Plate, Knife, Glass. Which item was in the *middle* position?',
      options: ['Fork', 'Spoon', 'Plate', 'Knife'],
      correctAnswer: 2,
    },
    {
      id: 'memory_010',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize this color sequence: Red, Green, Blue. What was the *first* color?',
      options: ['Green', 'Blue', 'Red', 'Yellow'],
      correctAnswer: 2,
    },
    {
      id: 'memory_011',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question: 'Remember this word: LIBRARY. What was the *third* letter?',
      options: ['B', 'R', 'A', 'Y'],
      correctAnswer: 0,
    },
    {
      id: 'memory_012',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Memorize this short date: 1945. What is the sum of the digits?',
      options: ['15', '19', '17', '18'],
      correctAnswer: 1,
      explanation: '$1+9+4+5 = 19$',
    },
    {
      id: 'memory_013',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize this sequence: 10, 50, 90. What was the middle number?',
      options: ['10', '50', '90', 'None'],
      correctAnswer: 1,
    },
    {
      id: 'memory_014',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question:
        'Remember these directions: North, East, South, West. Which direction was third?',
      options: ['North', 'East', 'South', 'West'],
      correctAnswer: 2,
    },
    {
      id: 'memory_015',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Study this 5-digit number: 93175. What is the difference between the first and last digit?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      explanation: '$9 - 5 = 4$',
    },
    {
      id: 'memory_016',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'easy',
      question:
        'Memorize these animals: DOG, CAT, BIRD. Which animal was listed second?',
      options: ['DOG', 'CAT', 'BIRD', 'FISH'],
      correctAnswer: 1,
    },
    {
      id: 'memory_017',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'medium',
      question:
        'Remember this sequence of letters: K, L, M, N. What letter was before N?',
      options: ['K', 'L', 'M', 'O'],
      correctAnswer: 2,
    },
    {
      id: 'memory_018',
      type: 'Memory',
      icon: '🧠',
      difficulty: 'hard',
      question:
        'Study this pattern: $\triangle$, $square$, $star$, $square$. Which shape appeared twice?',
      options: ['Triangle', 'Star', 'Square', 'Circle'],
      correctAnswer: 2,
    },

    // ======================================================================
    // LOGIC PUZZLES (Total: 18)
    // ======================================================================
    {
      id: 'logic_001',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question:
        'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
      options: ['Yes', 'No', 'Cannot determine', 'Sometimes'],
      correctAnswer: 0,
      explanation: 'If A $in$ B and B $in$ C, then A $in$ C.',
    },
    {
      id: 'logic_002',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question:
        'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?',
      options: ['$0.10', '$0.05', '$0.15', '$0.20'],
      correctAnswer: 1,
      explanation:
        'Let $B$ be the ball cost. Bat cost is $B + 1.00$. $B + (B + 1.00) = 1.10$. $2B = 0.10$. $B = 0.05$.',
    },
    {
      id: 'logic_003',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question:
        'If you overtake the person in 2nd place in a race, what position are you in?',
      options: ['1st', '2nd', '3rd', '4th'],
      correctAnswer: 1,
      explanation: 'You take the 2nd place spot.',
    },
    {
      id: 'logic_004',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question:
        'A man looks at a painting and says, "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the painting?',
      options: ['His Father', 'His Son', 'His Grandfather', 'Himself'],
      correctAnswer: 1,
      explanation:
        '"My father\'s son" is the man himself (since he has no siblings). The man in the painting is the son of the speaker.',
    },
    {
      id: 'logic_005',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question: 'What is always coming, but never arrives?',
      options: ['Tomorrow', 'Sleep', 'An email', 'A check'],
      correctAnswer: 0,
      explanation:
        'Tomorrow always becomes "today," so it never arrives as "tomorrow."',
    },
    {
      id: 'logic_006',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question:
        'There are two coins that add up to 30 cents, and one of them is not a nickel. What are the two coins?',
      options: [
        'A quarter and a nickel',
        'Two dimes and a penny',
        'A quarter and a penny',
        'A quarter and a five-cent piece',
      ],
      correctAnswer: 0,
      explanation:
        'The quarter is not a nickel, but the second coin *is* a nickel.',
    },
    {
      id: 'logic_007',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question:
        'Three people were walking. The first two are the mother and daughter. The last two are the mother and daughter. How many people are there?',
      options: ['4', '3', '2', '1'],
      correctAnswer: 1,
      explanation: 'A grandmother, a mother, and a daughter.',
    },
    {
      id: 'logic_008',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question: 'What is full of holes but still holds water?',
      options: ['A sponge', 'A bucket', 'A sieve', 'A barrel'],
      correctAnswer: 0,
      explanation:
        'A sponge absorbs and holds water despite having many holes.',
    },
    {
      id: 'logic_009',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question: 'What is always in front of you but can’t be seen?',
      options: ['Your past', 'The future', 'Your reflection', 'The wind'],
      correctAnswer: 1,
      explanation: 'The future.',
    },
    {
      id: 'logic_010',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question:
        'You see a boat filled with people, but there isn’t a single person on board. How is that possible?',
      options: [
        'They are ghosts',
        'They are asleep',
        'They all jumped off',
        'All the people are married',
      ],
      correctAnswer: 3,
      explanation: 'The people on the boat are a married couple.',
    },
    {
      id: 'logic_011',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question:
        'Two fathers and two sons go fishing. They catch three fish, but each person catches one fish. How is this possible?',
      options: [
        'There are only three people',
        'They share the fish',
        'One person is both father and son',
        'They lied',
      ],
      correctAnswer: 0,
      explanation:
        'A grandfather, his son, and his grandson (three people total).',
    },
    {
      id: 'logic_012',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question: 'What can be broken, even if you never pick it up or touch it?',
      options: ['A glass', 'A promise', 'A mirror', 'A law'],
      correctAnswer: 1,
      explanation: 'A promise.',
    },
    {
      id: 'logic_013',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question:
        'What is special about the following words: Madam, Level, Civic, Radar?',
      options: [
        'They are all cities',
        'They are palindromes',
        'They contain the letter A',
        'They have five letters',
      ],
      correctAnswer: 1,
      explanation: 'They read the same backward as forward (palindromes).',
    },
    {
      id: 'logic_014',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question: 'I have a head and a tail, but no body. What am I?',
      options: ['A snake', 'A coin', 'A thought', 'A cloud'],
      correctAnswer: 1,
      explanation: 'A coin has a "head" side and a "tail" side.',
    },
    {
      id: 'logic_015',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question:
        "If two hours ago it was twice as long after one o'clock as it was before one o'clock, what time is it now?",
      options: ['2:00', '3:00', '4:00', '5:00'],
      correctAnswer: 2,
      explanation:
        'Two hours ago was 2:00. This is 60 minutes after 1:00, which is twice as long as 30 minutes before 1:00. The time now is 4:00.',
    },
    {
      id: 'logic_016',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'easy',
      question: 'What two things can you never eat for breakfast?',
      options: [
        'Eggs and bacon',
        'Lunch and Dinner',
        'Cereal and Toast',
        'Coffee and Juice',
      ],
      correctAnswer: 1,
      explanation:
        'You cannot eat meals intended for later in the day for breakfast.',
    },
    {
      id: 'logic_017',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'medium',
      question: 'What can be heard and held, but never seen?',
      options: ['A secret', 'An echo', 'A word', 'A photograph'],
      correctAnswer: 2,
      explanation: 'A word is heard and held in memory, but not seen.',
    },
    {
      id: 'logic_018',
      type: 'Logic',
      icon: '🎯',
      difficulty: 'hard',
      question:
        'A truck drives 10 miles. It gets 10 miles per gallon. How many gallons of gas were used?',
      options: ['0', '1', '10', '100'],
      correctAnswer: 1,
      explanation: '10 miles driven / 10 mpg = 1 gallon.',
    },

    // ======================================================================
    // RIDDLES (Total: 18)
    // ======================================================================
    {
      id: 'riddle_001',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question:
        'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
      options: ['Echo', 'Shadow', 'Dream', 'Thought'],
      correctAnswer: 0,
    },
    {
      id: 'riddle_002',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question:
        "What has keys but no locks, space but no room, and you can enter but can't go inside?",
      options: ['A house', 'A keyboard', 'A piano', 'A map'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_003',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question: 'The more you take away, the larger it becomes. What is it?',
      options: ['A hole', 'Debt', 'A shadow', 'Time'],
      correctAnswer: 0,
    },
    {
      id: 'riddle_004',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question:
        "What is light as a feather, but even the strongest person can't hold it for long?",
      options: ['A thought', 'Air', 'Breath', 'A minute'],
      correctAnswer: 2,
    },
    {
      id: 'riddle_005',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question:
        'I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?',
      options: ['A globe', 'A map', 'An ocean', 'A desert'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_006',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question: 'What question can you never answer yes to?',
      options: [
        'Are you ready?',
        'Are you sleeping yet?',
        'Can you fly?',
        'Do you speak English?',
      ],
      correctAnswer: 1,
    },
    {
      id: 'riddle_007',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question: 'What runs all around a backyard without moving?',
      options: ['A dog', 'A river', 'A hose', 'A fence'],
      correctAnswer: 3,
    },
    {
      id: 'riddle_008',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question: "What has one head, one foot, and four legs, but can't walk?",
      options: ['A horse', 'A table', 'A bed', 'A chair'],
      correctAnswer: 2,
    },
    {
      id: 'riddle_009',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question:
        'What belongs to you, but other people use it more than you do?',
      options: ['Your car', 'Your name', 'Your house', 'Your money'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_010',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question:
        'I have many layers, but if you cut me, you will cry. What am I?',
      options: ['An onion', 'A book', 'A gift', 'A person'],
      correctAnswer: 0,
    },
    {
      id: 'riddle_011',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question: 'What gets wet while drying?',
      options: ['A leaf', 'A sponge', 'A towel', 'A cloth'],
      correctAnswer: 2,
    },
    {
      id: 'riddle_012',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question:
        'I am tall when I am young, and I am short when I am old. What am I?',
      options: ['A person', 'A tree', 'A ruler', 'A candle'],
      correctAnswer: 3,
    },
    {
      id: 'riddle_013',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question: 'What has to be broken before you can use it?',
      options: ['A glass', 'An egg', 'A promise', 'A mirror'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_014',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question: 'What has an eye but cannot see?',
      options: ['A cyclops', 'A needle', 'A potato', 'A hurricane'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_015',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question: 'What is always answered without being asked?',
      options: ['A sneeze', 'A yawn', 'A cough', 'A breath'],
      correctAnswer: 0,
      explanation: 'A sneeze is typically met with a "Bless you!"',
    },
    {
      id: 'riddle_016',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'easy',
      question: 'What begins with T, ends with T, and has T in it?',
      options: ['A teapot', 'A tent', 'A treat', 'A tomato'],
      correctAnswer: 0,
    },
    {
      id: 'riddle_017',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'medium',
      question: 'Feed me and I live, give me a drink and I die. What am I?',
      options: ['A plant', 'A fire', 'An animal', 'A fish'],
      correctAnswer: 1,
    },
    {
      id: 'riddle_018',
      type: 'Riddle',
      icon: '💡',
      difficulty: 'hard',
      question: 'What can you catch, but not throw?',
      options: ['A ball', 'A cold', 'A frisbee', 'A fish'],
      correctAnswer: 1,
    },

    // ======================================================================
    // PATTERN PUZZLES (Total: 18)
    // ======================================================================
    {
      id: 'pattern_001',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'Which shape completes the pattern?\n△ ○ △ ○ △ ?',
      options: ['○', '△', '□', '◇'],
      correctAnswer: 0,
      explanation: 'The pattern alternates between triangle and circle.',
    },
    {
      id: 'pattern_002',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'What comes next?\n2, 4, 8, 16, ?',
      options: ['24', '28', '32', '64'],
      correctAnswer: 2,
      explanation: 'The pattern is multiplying by 2 (powers of 2).',
    },
    {
      id: 'pattern_003',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'Complete the pattern:\nA1, B2, C4, D7, ?',
      options: ['E10', 'E11', 'E12', 'F11'],
      correctAnswer: 1,
      explanation:
        'Letter advances by 1. Number advances by $+1, +2, +3, +4$. $7+4=11$.',
    },
    {
      id: 'pattern_004',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'What is the missing letter?\nZ, Y, X, W, ?',
      options: ['V', 'U', 'A', 'T'],
      correctAnswer: 0,
      explanation: 'The pattern is the alphabet in reverse order.',
    },
    {
      id: 'pattern_005',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'What comes next?\n1, 1, 2, 3, 5, 8, ?',
      options: ['12', '13', '15', '18'],
      correctAnswer: 1,
      explanation:
        'This is the Fibonacci sequence: each number is the sum of the two preceding ones. $5 + 8 = 13$.',
    },
    {
      id: 'pattern_006',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'What number follows?\n1, 4, 9, 16, 25, ?',
      options: ['30', '32', '36', '40'],
      correctAnswer: 2,
      explanation:
        'The sequence is the square of the whole numbers: $1^2, 2^2, 3^2, 4^2, 5^2, 6^2 = 36$.',
    },
    {
      id: 'pattern_007',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'What comes next in the sequence? J, F, M, A, M, J, ?',
      options: ['A', 'J', 'S', 'O'],
      correctAnswer: 1,
      explanation:
        'First letter of the months of the year: January, February... June, **July** (J).',
    },
    {
      id: 'pattern_008',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'What is the next number? 100, 96, 92, 88, ?',
      options: ['84', '85', '80', '78'],
      correctAnswer: 0,
      explanation: 'The pattern is subtracting 4 each time. $88 - 4 = 84$.',
    },
    {
      id: 'pattern_009',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'Complete the sequence: 1, 8, 27, 64, ?',
      options: ['81', '100', '125', '216'],
      correctAnswer: 2,
      explanation:
        'The sequence is the cubes of whole numbers: $1^3, 2^3, 3^3, 4^3, 5^3 = 125$.',
    },
    {
      id: 'pattern_010',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'What is the next shape? □, △, □, △, □, ?',
      options: ['□', '△', '○', '◇'],
      correctAnswer: 1,
      explanation: 'The pattern alternates between square and triangle.',
    },
    {
      id: 'pattern_011',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'What is the next number? 3, 9, 27, 81, ?',
      options: ['162', '243', '324', '486'],
      correctAnswer: 1,
      explanation:
        'The pattern is multiplying by 3 each time (powers of 3). $81 \times 3 = 243$.',
    },
    {
      id: 'pattern_012',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'Find the missing letter: C, F, I, L, O, ?',
      options: ['P', 'Q', 'R', 'S'],
      correctAnswer: 2,
      explanation:
        'The pattern is skipping two letters in the alphabet between each one (C+3=F, O+3=R).',
    },
    {
      id: 'pattern_013',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'What comes next? 1, 2, 4, 8, 16, ?',
      options: ['24', '30', '32', '36'],
      correctAnswer: 2,
      explanation: 'The pattern is doubling the previous number.',
    },
    {
      id: 'pattern_014',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'Complete the sequence: 5, 25, 125, 625, ?',
      options: ['1250', '2500', '3125', '6500'],
      correctAnswer: 2,
      explanation:
        'The pattern is multiplying by 5 each time. $625 \times 5 = 3125$.',
    },
    {
      id: 'pattern_015',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'What is the next item? O, T, T, F, F, S, S, E, N, ?',
      options: ['T', 'O', 'I', 'E'],
      correctAnswer: 0,
      explanation:
        'The pattern is the first letter of the numbers: One, Two, Three... Nine, **Ten** (T).',
    },
    {
      id: 'pattern_016',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'easy',
      question: 'What is the next number? 10, 8, 6, 4, ?',
      options: ['1', '2', '3', '0'],
      correctAnswer: 1,
      explanation: 'The pattern is subtracting 2 each time.',
    },
    {
      id: 'pattern_017',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'medium',
      question: 'Find the missing letter: A, C, E, G, ?',
      options: ['H', 'I', 'J', 'K'],
      correctAnswer: 1,
      explanation:
        'The pattern is skipping one letter (A, B, C, D, E, F, G, **H**, I).',
    },
    {
      id: 'pattern_018',
      type: 'Pattern',
      icon: '🔷',
      difficulty: 'hard',
      question: 'What is the next number? 1, 2, 4, 7, 11, ?',
      options: ['14', '15', '16', '17'],
      correctAnswer: 2,
      explanation:
        'The difference between numbers increases by one each time: $+1, +2, +3, +4, +5$. $11 + 5 = 16$.',
    },
  ];

  constructor() {}

  /**
   * Get daily set of 5 puzzles (one from each category)
   */
  getDailyPuzzles(): Puzzle[] {
    const categories = ['Math', 'Memory', 'Logic', 'Riddle', 'Pattern'];
    const dailyPuzzles: Puzzle[] = [];

    categories.forEach((category) => {
      const categoryPuzzles = this.puzzleBank.filter(
        (p) => p.type === category
      );
      const randomPuzzle =
        categoryPuzzles[Math.floor(Math.random() * categoryPuzzles.length)];
      dailyPuzzles.push(randomPuzzle);
    });

    return dailyPuzzles;
  }

  /**
   * Get puzzles by difficulty
   */
  getPuzzlesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Puzzle[] {
    return this.puzzleBank.filter((p) => p.difficulty === difficulty);
  }

  /**
   * Get puzzles by type
   */
  getPuzzlesByType(type: string): Puzzle[] {
    return this.puzzleBank.filter((p) => p.type === type);
  }

  /**
   * Get random puzzle
   */
  getRandomPuzzle(): Puzzle {
    return this.puzzleBank[Math.floor(Math.random() * this.puzzleBank.length)];
  }

  /**
   * Get all puzzles
   */
  getAllPuzzles(): Puzzle[] {
    return this.puzzleBank;
  }

  /**
   * Add custom puzzle
   */
  addPuzzle(puzzle: Puzzle): void {
    this.puzzleBank.push(puzzle);
  }
}
