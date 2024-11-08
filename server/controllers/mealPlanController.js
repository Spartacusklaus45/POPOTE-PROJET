import MealPlan from '../models/MealPlan.js';

export const createMealPlan = async (req, res) => {
  try {
    const mealPlan = new MealPlan({
      ...req.body,
      user: req.user.id
    });

    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: 'Error creating meal plan' });
  }
};

export const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id })
      .populate('meals.recipe')
      .sort('-startDate');
    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal plans' });
  }
};

export const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal plan' });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedMealPlan);
  } catch (err) {
    res.status(500).json({ message: 'Error updating meal plan' });
  }
};

export const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await mealPlan.remove();
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting meal plan' });
  }
};