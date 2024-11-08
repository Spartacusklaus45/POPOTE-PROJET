import { FAQ } from '../models/FAQ.js';

export const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la FAQ' });
  }
};

export const getAllFAQs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const faqs = await FAQ.find(query)
      .populate('relatedFaqs')
      .sort('category order');

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des FAQs' });
  }
};

export const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
      .populate('relatedFaqs');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la FAQ' });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    ).populate('relatedFaqs');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la FAQ' });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }

    // Désactiver plutôt que supprimer
    faq.isPublished = false;
    await faq.save();

    res.json({ message: 'FAQ désactivée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la FAQ' });
  }
};

export const voteFAQ = async (req, res) => {
  try {
    const { isHelpful } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }

    await faq.vote(isHelpful);
    res.json({
      helpfulScore: faq.getHelpfulScore(),
      votes: faq.helpfulVotes
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du vote' });
  }
};

export const getFAQsByCategory = async (req, res) => {
  try {
    const faqs = await FAQ.find({
      category: req.params.category,
      isPublished: true
    }).sort('order');

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des FAQs' });
  }
};

export const searchFAQs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Terme de recherche requis' });
    }

    const faqs = await FAQ.find({
      $text: { $search: q },
      isPublished: true
    }, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la recherche des FAQs' });
  }
};