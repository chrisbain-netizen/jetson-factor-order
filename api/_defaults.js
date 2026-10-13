const DEFAULT_MEALS = [
  { id: 'm1', name: 'Herb-Crusted Chicken with Roasted Vegetables', tag: 'chefs-choice', type: 'meal' }
];

const DEFAULT_CONFIG = {
  teamNames: ['Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'],
  meals: DEFAULT_MEALS,
  mealsPerPerson: 5,
  drinksPerPerson: 2
};

module.exports = { DEFAULT_MEALS, DEFAULT_CONFIG };
