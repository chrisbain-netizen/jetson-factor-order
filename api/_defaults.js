const DEFAULT_MEALS = [
  { id: 'm1', name: 'Herb-Crusted Chicken with Roasted Vegetables', tag: 'chefs-choice' },
  { id: 'm2', name: 'Beef Meatballs in Marinara with Zucchini Noodles', tag: 'chefs-choice' },
  { id: 'm3', name: 'Teriyaki Salmon with Sesame Broccoli', tag: 'protein-plus' },
  { id: 'm4', name: 'Garlic Butter Steak with Cauliflower Mash', tag: 'keto' },
  { id: 'm5', name: 'Pesto Chicken with Zucchini Ribbons', tag: 'keto' },
  { id: 'm6', name: 'Lemon Herb Cod with Quinoa Pilaf', tag: 'calorie-smart' },
  { id: 'm7', name: 'Turkey Meatloaf with Green Beans', tag: 'calorie-smart' },
  { id: 'm8', name: 'Double Chicken Breast with Sweet Potato Mash', tag: 'protein-plus' },
  { id: 'm9', name: 'Chickpea Tikka Masala with Basmati Rice', tag: 'vegan-veggie' },
  { id: 'm10', name: 'Cauliflower & Chickpea Curry Bowl', tag: 'vegan-veggie' },
  { id: 'm11', name: 'Blackened Tilapia with Charred Corn Salsa', tag: 'calorie-smart' },
  { id: 'm12', name: 'Bunless Bison Burger with Roasted Root Vegetables', tag: 'keto' },
  { id: 'm13', name: 'Orange Ginger Beef with Broccoli', tag: 'chefs-choice' },
  { id: 'm14', name: 'Cajun Shrimp with Cheesy Grits', tag: 'chefs-choice' },
  { id: 'm15', name: 'Grilled Chicken Caesar Power Bowl', tag: 'protein-plus' },
  { id: 'm16', name: 'Stuffed Bell Peppers with Ground Turkey', tag: 'calorie-smart' },
  { id: 'm17', name: 'Thai-Style Peanut Tofu with Vegetables', tag: 'vegan-veggie' },
  { id: 'm18', name: 'Pork Carnitas with Cilantro Lime Cauliflower Rice', tag: 'keto' },
  { id: 'm19', name: 'BBQ Pulled Chicken with Street Corn', tag: 'chefs-choice' },
  { id: 'm20', name: 'Mushroom & Spinach Egg White Frittata', tag: 'vegan-veggie' }
];

const DEFAULT_CONFIG = {
  teamNames: ['Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'],
  meals: DEFAULT_MEALS,
  mealsPerPerson: 5
};

module.exports = { DEFAULT_MEALS, DEFAULT_CONFIG };
